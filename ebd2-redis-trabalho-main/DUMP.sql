DROP DATABASE IF EXISTS mini_projeto_ebd2;
CREATE DATABASE mini_projeto_ebd2;

DROP TABLE IF EXISTS mini_projeto_ebd2.products;
CREATE TABLE mini_projeto_ebd2.products(
	ID INT not null primary key auto_increment,
    NAME varchar(50) not null,
    PRICE decimal(10,2) not null default 0,
    DESCRIPTION varchar(500) not null
);

INSERT INTO mini_projeto_ebd2.products (
	NAME,
    PRICE,
    DESCRIPTION
) VALUES (
	'ROLEX SUBMARINER',
    12000,
    'Descrição do relógio de pulso'
);

INSERT INTO mini_projeto_ebd2.products (
	NAME,
    PRICE,
    DESCRIPTION
) VALUES (
	'ROLEX DAYTONA',
    230000,
    'Descrição do relógio de pulso'
);

-- Comandos eventualmente úteis no MySQL
-- Criação de um usuário e permissão no schema
/*
CREATE USER IF NOT EXISTS 'ebd2'@'%' IDENTIFIED BY 'senhaqualquer';
GRANT ALL ON mini_projeto_ebd2.* TO 'ebd2'@'%';*/


CREATE TABLE databaseChanges (
    ID INT not null primary key auto_increment,
    KEY_TO_DELETE INT,
    CHANGE_DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    STATUS VARCHAR(50) DEFAULT 'waiting'
);

DELIMITER //

CREATE TRIGGER AFTER_PRODUCT_DELETE
AFTER DELETE ON PRODUCTS
FOR EACH ROW
BEGIN
    INSERT INTO databaseChanges (KEY_TO_DELETE, CHANGE_DATE, STATUS)
    VALUES (OLD.id, NOW(), 'waiting');
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER AFTER_PRODUCT_UPDATE
AFTER UPDATE ON PRODUCTS
FOR EACH ROW
BEGIN
    INSERT INTO databaseChanges (KEY_TO_DELETE, CHANGE_DATE, STATUS)
    VALUES (OLD.id, NOW(), 'waiting');
END //

DELIMITER ;