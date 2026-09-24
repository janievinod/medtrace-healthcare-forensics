-- MEDTRACE synthetic demonstration database. All identities, MRNs, IPs and events are fabricated.
-- PostgreSQL 15+. Load into an EMPTY database: psql -v ON_ERROR_STOP=1 -d medtrace -f medtrace_database.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE anomaly_status_enum AS ENUM ('open','investigating','closed','false_positive');
CREATE TYPE investigation_status_enum AS ENUM ('open','in_progress','closed');
CREATE TYPE integrity_status_enum AS ENUM ('verified','tampered');

CREATE TABLE roles (role_id bigserial PRIMARY KEY, role_name text NOT NULL UNIQUE);
CREATE TABLE departments (department_id bigserial PRIMARY KEY, department_name text NOT NULL UNIQUE);
CREATE TABLE users (user_id bigserial PRIMARY KEY, username text NOT NULL UNIQUE, full_name text NOT NULL, email text NOT NULL UNIQUE, role_id bigint NOT NULL REFERENCES roles, department_id bigint REFERENCES departments, employee_code text UNIQUE, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE patients (patient_id bigserial PRIMARY KEY, mrn text NOT NULL UNIQUE, full_name text NOT NULL, date_of_birth date NOT NULL, gender text, primary_department_id bigint REFERENCES departments, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE devices (device_id bigserial PRIMARY KEY, device_name text NOT NULL UNIQUE, is_trusted boolean NOT NULL DEFAULT true);
CREATE TABLE sessions (session_id bigserial PRIMARY KEY, user_id bigint NOT NULL REFERENCES users, device_id bigint REFERENCES devices, login_time timestamptz NOT NULL DEFAULT now(), logout_time timestamptz, ip_address inet);
CREATE TABLE ehr_access_logs (log_id bigserial PRIMARY KEY, session_id bigint REFERENCES sessions, user_id bigint NOT NULL REFERENCES users, patient_id bigint NOT NULL REFERENCES patients, device_id bigint REFERENCES devices, access_type text NOT NULL CHECK (access_type IN ('view','create','update','delete','export','print')), table_accessed text NOT NULL DEFAULT 'patient_records', record_id text, access_time timestamptz NOT NULL DEFAULT now(), success boolean NOT NULL DEFAULT true, ip_address inet, notes text);
CREATE TABLE events (event_id bigserial PRIMARY KEY, user_id bigint REFERENCES users, department_id bigint REFERENCES departments, event_time timestamptz NOT NULL DEFAULT now(), event_type text NOT NULL, description text NOT NULL);
CREATE TABLE event_logs (event_id bigint NOT NULL REFERENCES events ON DELETE CASCADE, log_id bigint NOT NULL REFERENCES ehr_access_logs, PRIMARY KEY (event_id,log_id));
CREATE TABLE anomalies (anomaly_id bigserial PRIMARY KEY, event_id bigint REFERENCES events, user_id bigint NOT NULL REFERENCES users, detected_at timestamptz NOT NULL DEFAULT now(), anomaly_type text NOT NULL, description text NOT NULL, status anomaly_status_enum NOT NULL DEFAULT 'open');
CREATE TABLE risk_scores (anomaly_id bigint PRIMARY KEY REFERENCES anomalies ON DELETE CASCADE, risk_score numeric(5,2) NOT NULL CHECK (risk_score BETWEEN 0 AND 100), risk_level text NOT NULL CHECK (risk_level IN ('low','medium','high','critical')), scoring_reason text NOT NULL);
CREATE TABLE investigations (investigation_id bigserial PRIMARY KEY, opened_by bigint NOT NULL REFERENCES users, assigned_to bigint REFERENCES users, opened_at timestamptz NOT NULL DEFAULT now(), closed_at timestamptz, status investigation_status_enum NOT NULL DEFAULT 'open', summary text);
CREATE TABLE investigation_anomalies (investigation_id bigint NOT NULL REFERENCES investigations ON DELETE CASCADE, anomaly_id bigint NOT NULL REFERENCES anomalies, PRIMARY KEY(investigation_id,anomaly_id));
CREATE TABLE evidence (evidence_id bigserial PRIMARY KEY, investigation_id bigint NOT NULL REFERENCES investigations, log_id bigint REFERENCES ehr_access_logs, evidence_type varchar(50) NOT NULL, description text NOT NULL, collected_by bigint REFERENCES users, collected_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE forensic_reports (report_id bigserial PRIMARY KEY, investigation_id bigint NOT NULL UNIQUE REFERENCES investigations, generated_by bigint REFERENCES users, generated_at timestamptz NOT NULL DEFAULT now(), findings text NOT NULL, conclusion text, report_hash text NOT NULL);
CREATE TABLE integrity_checks (check_id bigserial PRIMARY KEY, patient_id bigint REFERENCES patients, table_name varchar(100) NOT NULL, record_id varchar(50) NOT NULL, hash_algorithm varchar(20) NOT NULL DEFAULT 'SHA-256', original_hash varchar(128) NOT NULL, current_hash varchar(128) NOT NULL, integrity_status integrity_status_enum NOT NULL, verified_by bigint REFERENCES users, verification_time timestamptz NOT NULL DEFAULT now());
CREATE TABLE audit_log (audit_id bigserial PRIMARY KEY, actor_user_id bigint REFERENCES users, action text NOT NULL, target_table text NOT NULL, target_id text, details jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON ehr_access_logs (access_time DESC);
CREATE INDEX ON ehr_access_logs (user_id,access_time DESC);
CREATE INDEX ON ehr_access_logs (patient_id,access_time DESC);
CREATE INDEX ON anomalies (status,detected_at DESC);
CREATE INDEX ON sessions (user_id,login_time DESC);

CREATE FUNCTION audit_ehr_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
 INSERT INTO audit_log (actor_user_id,action,target_table,target_id,details)
 VALUES (NEW.user_id,'create_access_log','ehr_access_logs',NEW.log_id::text,jsonb_build_object('patient_id',NEW.patient_id,'access_type',NEW.access_type));
 RETURN NEW;
END $$;
CREATE TRIGGER ehr_insert_audit AFTER INSERT ON ehr_access_logs FOR EACH ROW EXECUTE FUNCTION audit_ehr_insert();

CREATE VIEW v_device_activity AS SELECT d.device_id,d.device_name,d.is_trusted,COUNT(l.log_id)::int AS access_count,MAX(l.access_time) AS last_access FROM devices d LEFT JOIN ehr_access_logs l USING(device_id) GROUP BY d.device_id;
CREATE VIEW v_user_risk_summary AS SELECT u.user_id,u.full_name,COUNT(DISTINCT a.anomaly_id)::int AS anomaly_count,COALESCE(MAX(r.risk_score),0) AS max_risk_score,COUNT(DISTINCT l.log_id)::int AS access_count FROM users u LEFT JOIN anomalies a USING(user_id) LEFT JOIN risk_scores r USING(anomaly_id) LEFT JOIN ehr_access_logs l USING(user_id) GROUP BY u.user_id;
CREATE VIEW v_suspicious_activity AS SELECT a.anomaly_id,a.detected_at,a.anomaly_type,a.status,a.description,u.user_id,u.full_name AS user_name,r.risk_score,r.risk_level,e.event_time FROM anomalies a JOIN users u USING(user_id) LEFT JOIN risk_scores r USING(anomaly_id) LEFT JOIN events e USING(event_id) ORDER BY r.risk_score DESC NULLS LAST,a.detected_at DESC;
CREATE VIEW v_investigation_timeline AS SELECT ia.investigation_id,a.anomaly_id,e.event_time,a.anomaly_type AS event_type,a.description,r.risk_score FROM investigation_anomalies ia JOIN anomalies a USING(anomaly_id) LEFT JOIN events e USING(event_id) LEFT JOIN risk_scores r USING(anomaly_id);
CREATE VIEW v_integrity_status AS SELECT c.*,p.mrn,p.full_name AS patient_name,u.full_name AS verifier_name FROM integrity_checks c LEFT JOIN patients p USING(patient_id) LEFT JOIN users u ON u.user_id=c.verified_by;

INSERT INTO roles(role_name) VALUES ('physician'),('nurse'),('administrator'),('security_analyst');
INSERT INTO departments(department_name) VALUES ('Emergency'),('Cardiology'),('Oncology'),('Security');
INSERT INTO users(username,full_name,email,role_id,department_id,employee_code)
SELECT 'synthetic_user_'||n, 'Synthetic Staff '||n,'synthetic_user_'||n||'@example.invalid', CASE WHEN n <= 8 THEN 1 WHEN n <= 16 THEN 2 WHEN n <= 18 THEN 3 ELSE 4 END, 1+(n%4), 'DEMO-'||lpad(n::text,3,'0') FROM generate_series(1,20) n;
INSERT INTO patients(mrn,full_name,date_of_birth,gender,primary_department_id)
SELECT 'DEMO-MRN-'||lpad(n::text,5,'0'),'Synthetic Patient '||n,date '1940-01-01'+((n*137)%27000),CASE WHEN n%3=0 THEN 'unspecified' WHEN n%2=0 THEN 'female' ELSE 'male' END,1+(n%3) FROM generate_series(1,500) n;
INSERT INTO devices(device_name,is_trusted) SELECT 'synthetic-device-'||n,n%10<>0 FROM generate_series(1,30) n;
INSERT INTO sessions(user_id,device_id,login_time,logout_time,ip_address)
SELECT 1+(n%20),1+(n%30),now()-((n%72)||' hours')::interval,now()-((n%72)||' hours')::interval+interval '8 hours',('192.0.2.'||(1+n%200))::inet FROM generate_series(1,120) n;
INSERT INTO ehr_access_logs(session_id,user_id,patient_id,device_id,access_type,record_id,access_time,ip_address,notes)
SELECT 1+(n%120),1+((1+n%120)%20),1+((n*37)%500),1+((1+n%120)%30),CASE WHEN n%97=0 THEN 'export' WHEN n%11=0 THEN 'update' ELSE 'view' END, 'DEMO-REC-'||n,now()-(n*interval '37 seconds'),('192.0.2.'||(1+(1+n%120)%200))::inet,'SYNTHETIC sample' FROM generate_series(1,2400) n;
-- Inject an identifiable overnight bulk access case (400 distinct patients), matching the deck's scenario.
INSERT INTO sessions(user_id,device_id,login_time,ip_address) VALUES (1,30,date_trunc('day',now())+interval '2 hours','198.51.100.42');
INSERT INTO ehr_access_logs(session_id,user_id,patient_id,device_id,access_type,record_id,access_time,ip_address,notes)
SELECT currval('sessions_session_id_seq'),1,n,30,'view','DEMO-BULK-'||n,date_trunc('day',now())+interval '2 hours'+n*interval '2 seconds','198.51.100.42','SYNTHETIC flagged bulk-access scenario' FROM generate_series(1,400) n;
INSERT INTO events(user_id,department_id,event_time,event_type,description) VALUES
(1,1,date_trunc('day',now())+interval '2 hours','bulk_access','Synthetic physician accessed 400 distinct patients at 02:00 from untrusted device'),
(2,2,now()-interval '3 hours','export','Synthetic unusual record export'),
(3,3,now()-interval '5 hours','integrity','Synthetic record hash mismatch');
INSERT INTO event_logs(event_id,log_id) SELECT 1,log_id FROM ehr_access_logs WHERE notes='SYNTHETIC flagged bulk-access scenario';
INSERT INTO event_logs(event_id,log_id) SELECT 2,log_id FROM ehr_access_logs WHERE user_id=2 AND access_type='export' LIMIT 1;
INSERT INTO anomalies(event_id,user_id,anomaly_type,description) VALUES
(1,1,'bulk_access','400 distinct patient records accessed in a short overnight session'),
(2,2,'unusual_export','Unusual synthetic EHR record export'),
(3,3,'record_tampering','Simulated record integrity mismatch');
INSERT INTO risk_scores(anomaly_id,risk_score,risk_level,scoring_reason) VALUES
(1,96,'critical','400 unique patients; 02:00 access; untrusted device'),
(2,78,'high','Unusual export activity'),(3,91,'critical','Current record hash differs from reference hash');
INSERT INTO investigations(opened_by,assigned_to,summary) VALUES (19,20,'Review synthetic overnight bulk-access activity');
INSERT INTO investigation_anomalies VALUES (1,1);
INSERT INTO evidence(investigation_id,log_id,evidence_type,description,collected_by) SELECT 1,MIN(log_id),'access_log','Synthetic access log linked to bulk access',19 FROM event_logs WHERE event_id=1;
INSERT INTO forensic_reports(investigation_id,generated_by,findings,conclusion,report_hash) VALUES (1,19,'Synthetic case: 400 patient records viewed overnight.','Demo only; no real incident.',encode(digest('Synthetic case: 400 patient records viewed overnight.Demo only; no real incident.','sha256'),'hex'));
INSERT INTO integrity_checks(patient_id,table_name,record_id,original_hash,current_hash,integrity_status,verified_by) VALUES
(1,'patient_records','DEMO-REC-1',repeat('a',64),repeat('a',64),'verified',19),
(2,'patient_records','DEMO-REC-2',repeat('b',64),repeat('c',64),'tampered',19);
