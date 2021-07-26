USE employdb; 

INSERT INTO Department (name)
VALUES ('Sales'),  ('Engineering'), ('Finance'),  ('Legal');

INSERT INTO Role  (title, salary,department_id)
VALUES 
    ('Manager-Sales', 80000, 1),
    ('Sales Person', 60000, 1),
    ('Manager-Engineering', 10000, 2),
    ('Mech Engineer', 75000, 2),
    ('Manager-Finnace', 90000, 3),
    ('Accountant',80000,3),
    ('Manager-Legal',150000 ,4),
    ('Legal Advisor', 100000, 4);

INSERT INTO Employee   (first_name,last_name,role_id, manager_id)
VALUES 
    ('Sarah', 'Pins', 1, NULL),
    ('Liya', 'Randall', 2, 1),
    ('Matt', 'Lionel', 3, NULL),
    ('Norah', 'Maxime', 4, 3),
    ('Roger', 'Simmons', 5, NULL),
    ('Adrian', 'Troy', 6, 5),
    ('Rory', 'Ginger', 7, NULL),
    ('Tindall', 'Shark', 8, 7);
