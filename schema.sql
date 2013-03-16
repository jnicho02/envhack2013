-- Table: organisations

-- DROP TABLE organisations;

CREATE TABLE organisations
(
  gid serial NOT NULL,
  id integer,
  address character varying(50),
  postcode character varying(50),
  name character varying(50),
  type character varying(50),
  score smallint,
  geom geometry(Point),
  CONSTRAINT organisations_pkey PRIMARY KEY (gid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE organisations
  OWNER TO postgres;

-- Index: organisations_geom_gist

-- DROP INDEX organisations_geom_gist;

CREATE INDEX organisations_geom_gist
  ON organisations
  USING gist
  (geom);
  
  
  
  
-- Table: transactions

-- DROP TABLE transactions;

CREATE TABLE transactions
(
  gid serial NOT NULL,
  id integer,
  to_id integer,
  from_id integer,
  quantity integer,
  ewc_type character varying(50),
  date date,
  score smallint,
  geom geometry(Point),
  CONSTRAINT transactions_pkey PRIMARY KEY (gid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE transactions
  OWNER TO postgres;

-- Index: transactions_geom_gist

-- DROP INDEX transactions_geom_gist;

CREATE INDEX transactions_geom_gist
  ON transactions
  USING gist
  (geom);
  
  
  
  
-- Table: "EWC"

-- DROP TABLE "EWC";

CREATE TABLE "EWC"
(
  "ID" serial NOT NULL,
  "CODE" text,
  "DESCRIPTION" text,
  "PARENT_ID" integer,
  "CONCATENATED_CODE" text,
  CONSTRAINT "EWC_pkey" PRIMARY KEY ("ID")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "EWC"
  OWNER TO postgres;