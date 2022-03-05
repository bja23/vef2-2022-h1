
INSERT INTO users (name, username, password, isAdmin) VALUES ('Björgvin','admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', TRUE);
INSERT INTO users (name, username, password) VALUES ('NOTBjörgvin','notadmin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');

INSERT INTO flokkur (title) VALUES ('Pizza');
INSERT INTO flokkur (title) VALUES('Hamborgari');
INSERT INTO flokkur (title) VALUES('Pylsa');
INSERT INTO flokkur (title) VALUES('Drykkur');
INSERT INTO flokkur (title) VALUES('Nammi');

INSERT INTO vorur (title, price, description, image, "flokkurID") VALUES ('margarita', 2000, 'ostur og sosa', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/margarita_silv8z.jpg', 1);
INSERT INTO vorur (title, price, description, image, "flokkurID") VALUES ('pepperoni', 2100, 'ostur, sosa og pepperonu', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/pepperoni_t0mako.jpg', 1);
INSERT INTO vorur (title, price, description, image, "flokkurID") VALUES ('hawaii', 2100, 'ostur, sosa, annanas og skínka', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/hawaiian-pizza-recipe-605894-2_clcqmt.jpg', 1);

INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('ostlausborgari', 2000, 'ostlaus hamborgari', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/ostlaugborgari_ah3wvs.jpg', 2);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('ostborgari', 2200, 'ost hamborgari', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/ostborgari_yh6ddk.jpg', 2);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('baconborgari', 2500, 'hamborgari með ost og bacon', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/baconborgari_k5fm5s.jpg', 2);

INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('tompylsa', 1000, 'pylsa með engu ', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/puslamedengu_dk8syg.jpg', 3);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('tomatpylsa', 1200, 'pysla með tómatsósu', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/pylsamedTomatsosu_nsvisj.jpg', 3);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('sineppylsa', 1500, 'pylsa með sinepi', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500948/sinepspylsa_riyqrn.png', 3);

INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('bounty', 400, 'bounty súkkulaði', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/bounty_gknzdr.png', 4);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('mars', 500, 'mars súkkulaði', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/mars_nfc33t.jpg', 4);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('twix', 450, 'twix súkkulaði', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/twix_omnpyr.jpg', 4);

INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('vatn', 200, 'vatn 500ml', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/vatn_zdgrom.jpg', 5);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('fanta', 400, 'fanta 500ml', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/fanta_olgxrh.jpg', 5);
INSERT INTO vorur (title, price, description, image, "flokkurID")
VALUES ('pepsi', 400, 'pepsi 500ml', 'https://res.cloudinary.com/dqhgwsiuq/image/upload/v1646500947/pepsi_iq07g9.jpg', 5);



