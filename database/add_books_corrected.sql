-- Add more books to make each country have 10 diverse, popular books
-- TaleTrail Book Database Expansion

-- United Kingdom (Country ID: 2) - adding 7 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Pride and Prejudice', 'Jane Austen', 'A witty and romantic tale of Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations in Regency England.', 1813, '9780141439518', 'images/covers/pride_prejudice.jpg', 4.6, 2500000, 2),
('Lord of the Rings', 'J.R.R. Tolkien', 'An epic fantasy adventure following Frodo Baggins as he journeys to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.', 1954, '9780547928227', 'images/covers/lord_rings.jpg', 4.7, 1800000, 2),
('Sherlock Holmes', 'Arthur Conan Doyle', 'The complete adventures of the worlds greatest detective and his loyal companion Dr. Watson solving mysteries in Victorian London.', 1887, '9780553212419', 'images/covers/sherlock_holmes.jpg', 4.5, 1200000, 2),
('Jane Eyre', 'Charlotte Bronte', 'The story of an orphaned girl who becomes a governess and falls in love with her mysterious employer, Mr. Rochester.', 1847, '9780141441146', 'images/covers/jane_eyre.jpg', 4.4, 950000, 2),
('Animal Farm', 'George Orwell', 'A satirical allegory about farm animals who rebel against their human farmer, hoping to create a society where animals can be equal, free, and happy.', 1945, '9780451526342', 'images/covers/animal_farm.jpg', 4.3, 1100000, 2),
('Wuthering Heights', 'Emily Bronte', 'A passionate tale of love and revenge set on the Yorkshire moors, following the turbulent relationship between Heathcliff and Catherine.', 1847, '9780141439556', 'images/covers/wuthering_heights.jpg', 4.2, 800000, 2),
('The Chronicles of Narnia', 'C.S. Lewis', 'A magical series beginning with four children who discover a wardrobe that leads to the enchanted land of Narnia.', 1950, '9780060764890', 'images/covers/chronicles_narnia.jpg', 4.5, 1300000, 2);

-- United States (Country ID: 1) - adding 7 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('The Catcher in the Rye', 'J.D. Salinger', 'The story of teenager Holden Caulfields alienation and rebellion as he wanders New York City after being expelled from prep school.', 1951, '9780316769174', 'images/covers/catcher_rye.jpg', 4.1, 1500000, 1),
('Gone with the Wind', 'Margaret Mitchell', 'An epic historical romance set during the American Civil War and Reconstruction era, following the strong-willed Scarlett OHara.', 1936, '9781451635621', 'images/covers/gone_wind.jpg', 4.3, 1200000, 1),
('The Adventures of Huckleberry Finn', 'Mark Twain', 'The adventures of a young boy and an escaped slave as they travel down the Mississippi River on a raft.', 1884, '9780486280615', 'images/covers/huck_finn.jpg', 4.2, 900000, 1),
('Of Mice and Men', 'John Steinbeck', 'A tragic tale of friendship between two displaced migrant ranch workers during the Great Depression in California.', 1937, '9780140177398', 'images/covers/mice_men.jpg', 4.0, 1100000, 1),
('The Grapes of Wrath', 'John Steinbeck', 'The story of the Joad familys journey from Oklahoma to California during the Great Depression.', 1939, '9780143039433', 'images/covers/grapes_wrath.jpg', 4.4, 850000, 1),
('Moby Dick', 'Herman Melville', 'The epic tale of Captain Ahabs obsessive quest for revenge against the white whale that destroyed his leg.', 1851, '9780142437247', 'images/covers/moby_dick.jpg', 4.1, 700000, 1),
('The Scarlet Letter', 'Nathaniel Hawthorne', 'Set in Puritan New England, the story follows Hester Prynne as she struggles with the consequences of adultery.', 1850, '9780142437261', 'images/covers/scarlet_letter.jpg', 4.0, 650000, 1);

-- France (Country ID: 3) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Les Miserables', 'Victor Hugo', 'An epic tale of redemption and social justice following ex-convict Jean Valjean in 19th-century France.', 1862, '9780451419439', 'images/covers/les_miserables.jpg', 4.5, 1300000, 3),
('The Count of Monte Cristo', 'Alexandre Dumas', 'A tale of betrayal, imprisonment, escape, and revenge set in early 19th-century France and Italy.', 1844, '9780140449266', 'images/covers/monte_cristo.jpg', 4.6, 1100000, 3),
('Madame Bovary', 'Gustave Flaubert', 'The story of Emma Bovary, a doctors wife who seeks escape from her mundane provincial life through romantic fantasies and affairs.', 1857, '9780143106494', 'images/covers/madame_bovary.jpg', 4.1, 750000, 3),
('The Stranger', 'Albert Camus', 'The story of Meursault, a man who seems indifferent to his own life and the world around him, exploring themes of existentialism.', 1942, '9780679720201', 'images/covers/the_stranger.jpg', 4.2, 900000, 3),
('In Search of Lost Time', 'Marcel Proust', 'A monumental work exploring memory, time, and art through the narrators recollections of his past.', 1913, '9780375751538', 'images/covers/lost_time.jpg', 4.3, 400000, 3),
('Candide', 'Voltaire', 'A satirical novella that follows the misadventures of Candide, a young man who believes in philosophical optimism.', 1759, '9780486266893', 'images/covers/candide.jpg', 4.0, 500000, 3),
('The Three Musketeers', 'Alexandre Dumas', 'The adventures of dArtagnan and his friends Athos, Porthos, and Aramis in 17th-century France.', 1844, '9780140449341', 'images/covers/three_musketeers.jpg', 4.4, 800000, 3),
('Nausea', 'Jean-Paul Sartre', 'A philosophical novel exploring existentialism through the experiences of Antoine Roquentin.', 1938, '9780811220309', 'images/covers/nausea.jpg', 4.0, 350000, 3);

-- Russia (Country ID: 8) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Crime and Punishment', 'Fyodor Dostoevsky', 'A psychological thriller about a poor student who commits murder and struggles with guilt and redemption.', 1866, '9780486415871', 'images/covers/crime_punishment.jpg', 4.5, 1200000, 8),
('Anna Karenina', 'Leo Tolstoy', 'A complex novel exploring love, family, and society through the tragic story of Anna Karenina and her affair with Count Vronsky.', 1877, '9780143035008', 'images/covers/anna_karenina.jpg', 4.4, 1000000, 8),
('The Brothers Karamazov', 'Fyodor Dostoevsky', 'A philosophical novel exploring faith, doubt, and morality through the story of three brothers and their fathers murder.', 1880, '9780374528379', 'images/covers/brothers_karamazov.jpg', 4.6, 800000, 8),
('Doctor Zhivago', 'Boris Pasternak', 'An epic romance set during the Russian Revolution, following poet Yuri Zhivago through love and political upheaval.', 1957, '9780307390950', 'images/covers/doctor_zhivago.jpg', 4.3, 650000, 8),
('One Day in the Life of Ivan Denisovich', 'Aleksandr Solzhenitsyn', 'A powerful depiction of life in a Soviet labor camp, following prisoner Ivan Denisovich through a single day.', 1962, '9780451228147', 'images/covers/ivan_denisovich.jpg', 4.2, 550000, 8),
('The Master and Margarita', 'Mikhail Bulgakov', 'A fantastical novel blending satire, philosophy, and the supernatural as the Devil visits Soviet Moscow.', 1967, '9780679760801', 'images/covers/master_margarita.jpg', 4.4, 700000, 8),
('Eugene Onegin', 'Alexander Pushkin', 'A novel in verse about a bored aristocrat and his tragic relationship with the innocent Tatyana.', 1833, '9780140448108', 'images/covers/eugene_onegin.jpg', 4.1, 450000, 8),
('Dead Souls', 'Nikolai Gogol', 'A satirical novel about Pavel Chichikovs scheme to buy dead serfs names to gain social status.', 1842, '9780375760082', 'images/covers/dead_souls.jpg', 4.0, 350000, 8);

-- India (Country ID: 5) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('The Mahabharata', 'Vyasa', 'An ancient Indian epic telling the story of the Kurukshetra War and the fates of the Kaurava and Pandava princes.', -400, '9780226846637', 'images/covers/mahabharata.jpg', 4.7, 500000, 5),
('The God of Small Things', 'Arundhati Roy', 'A haunting story of an Indian family, exploring love, loss, and the rigid caste system in Kerala.', 1997, '9780812979657', 'images/covers/god_small_things.jpg', 4.3, 800000, 5),
('Midnights Children', 'Salman Rushdie', 'A magical realist novel following Saleem Sinai, whose life parallels the partition and independence of India.', 1981, '9780812976533', 'images/covers/midnights_children.jpg', 4.2, 650000, 5),
('A Suitable Boy', 'Vikram Seth', 'An epic novel set in 1950s India, following four families and the search for a suitable husband for Lata.', 1993, '9780060926212', 'images/covers/suitable_boy.jpg', 4.4, 400000, 5),
('The White Tiger', 'Aravind Adiga', 'A darkly comic novel about Balram Halwais rise from rural poverty to entrepreneurial success in modern India.', 2008, '9781416562603', 'images/covers/white_tiger.jpg', 4.1, 550000, 5),
('Shantaram', 'Gregory David Roberts', 'The story of an escaped convict who flees to Bombay and becomes involved in the citys underworld.', 2003, '9780312330538', 'images/covers/shantaram.jpg', 4.3, 750000, 5),
('The Rozabal Line', 'Ashwin Sanghi', 'A thriller combining history, religion, and conspiracy theories about Jesus Christs possible survival and journey to India.', 2007, '9788192328454', 'images/covers/rozabal_line.jpg', 4.0, 300000, 5),
('Sacred Games', 'Vikram Chandra', 'A epic crime novel set in Mumbai, following police inspector Sartaj Singh and gangster Ganesh Gaitonde.', 2006, '9780060796785', 'images/covers/sacred_games.jpg', 4.2, 450000, 5);

-- Japan (Country ID: 4) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('The Tale of Genji', 'Murasaki Shikibu', 'Considered the worlds first novel, following Prince Genjis romantic adventures in Heian-era Japan.', 1010, '9780143039495', 'images/covers/tale_genji.jpg', 4.3, 200000, 4),
('Kafka on the Shore', 'Haruki Murakami', 'A surreal novel following a teenage runaway and an elderly man who can talk to cats in contemporary Japan.', 2002, '9781400079278', 'images/covers/kafka_shore.jpg', 4.4, 900000, 4),
('The Wind-Up Bird Chronicle', 'Haruki Murakami', 'A mysterious novel about a man searching for his missing wife and cat in suburban Tokyo.', 1994, '9780679775430', 'images/covers/windup_bird.jpg', 4.2, 650000, 4),
('Snow Country', 'Yasunari Kawabata', 'A lyrical novel about a Tokyo dilettantes affair with a geisha in a remote hot-spring town.', 1948, '9780679761044', 'images/covers/snow_country.jpg', 4.1, 300000, 4),
('The Book of Tea', 'Kakuzo Okakura', 'A classic work on Japanese tea ceremony and its philosophical significance in Eastern culture.', 1906, '9784805311943', 'images/covers/book_tea.jpg', 4.0, 150000, 4),
('Battle Royale', 'Koushun Takami', 'A dystopian thriller about students forced to fight to the death on a remote island.', 1999, '9781421565989', 'images/covers/battle_royale.jpg', 4.3, 500000, 4),
('The Sailor Who Fell from Grace with the Sea', 'Yukio Mishima', 'A haunting novel about a widow, her sailor lover, and her sons disturbing gang of friends.', 1963, '9780679750154', 'images/covers/sailor_grace.jpg', 4.1, 250000, 4),
('Kitchen', 'Banana Yoshimoto', 'A touching novella about grief, family, and finding comfort in unexpected places.', 1988, '9780802142443', 'images/covers/kitchen.jpg', 4.0, 400000, 4);

-- China (Country ID: 9) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Journey to the West', 'Wu Chengen', 'A classic Chinese novel following the Monkey King and his companions on their pilgrimage to obtain Buddhist scriptures.', 1592, '9780226971322', 'images/covers/journey_west.jpg', 4.5, 600000, 9),
('Dream of the Red Chamber', 'Cao Xueqin', 'An 18th-century Chinese novel depicting the rise and fall of a wealthy family during the Qing Dynasty.', 1791, '9780140442933', 'images/covers/red_chamber.jpg', 4.4, 400000, 9),
('Wild Swans', 'Jung Chang', 'A family memoir spanning three generations of Chinese women through the tumultuous 20th century.', 1991, '9780743246989', 'images/covers/wild_swans.jpg', 4.6, 750000, 9),
('The Good Earth', 'Pearl S. Buck', 'The story of Wang Lung, a Chinese farmer, and his rise from poverty to wealth in early 20th-century China.', 1931, '9780743272957', 'images/covers/good_earth.jpg', 4.3, 500000, 9),
('Red Sorghum', 'Mo Yan', 'A multigenerational saga set in rural China during the Second Sino-Japanese War.', 1987, '9780140168952', 'images/covers/red_sorghum.jpg', 4.2, 350000, 9),
('Balzac and the Little Chinese Seamstress', 'Dai Sijie', 'A coming-of-age story about two young men sent to a remote village during Chinas Cultural Revolution.', 2000, '9780385722209', 'images/covers/balzac_seamstress.jpg', 4.1, 300000, 9),
('Wolf Totem', 'Jiang Rong', 'A semi-autobiographical novel about a young intellectual sent to Inner Mongolia during the Cultural Revolution.', 2004, '9780143115144', 'images/covers/wolf_totem.jpg', 4.0, 250000, 9),
('The Three-Body Problem', 'Liu Cixin', 'A hard science fiction novel about humanitys first contact with an alien civilization.', 2006, '9780765382030', 'images/covers/three_body.jpg', 4.4, 800000, 9);

-- Nigeria (Country ID: 7) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Purple Hibiscus', 'Chimamanda Ngozi Adichie', 'A coming-of-age story about a young Nigerian girl discovering her voice amidst family turmoil and political unrest.', 2003, '9781616202415', 'images/covers/purple_hibiscus.jpg', 4.4, 500000, 7),
('Half of a Yellow Sun', 'Chimamanda Ngozi Adichie', 'A powerful novel about the Nigerian Civil War and its impact on the lives of several characters.', 2006, '9780007200283', 'images/covers/yellow_sun.jpg', 4.5, 600000, 7),
('The Joys of Motherhood', 'Buchi Emecheta', 'The story of Nnu Ego, a Nigerian woman struggling with motherhood and changing traditions in colonial Nigeria.', 1979, '9780807616214', 'images/covers/joys_motherhood.jpg', 4.2, 200000, 7),
('Americanah', 'Chimamanda Ngozi Adichie', 'A novel about a young Nigerian woman who travels to America for university and grapples with identity and belonging.', 2013, '9780307455925', 'images/covers/americanah.jpg', 4.3, 750000, 7),
('The Beautiful Ones Are Not Yet Born', 'Ayi Kwei Armah', 'A novel about corruption and moral decay in post-independence Ghana, relevant to broader African experiences.', 1968, '9780435905200', 'images/covers/beautiful_ones.jpg', 4.1, 150000, 7),
('So Long a Letter', 'Mariama Ba', 'A powerful epistolary novel about a Senegalese woman reflecting on her life, marriage, and friendship.', 1979, '9780435905201', 'images/covers/long_letter.jpg', 4.3, 180000, 7),
('The Palm-Wine Drinkard', 'Amos Tutuola', 'A fantastical novel rooted in Yoruba folklore about a mans journey to find his deceased palm-wine tapster.', 1952, '9780802151902', 'images/covers/palm_wine.jpg', 4.0, 120000, 7),
('Nervous Conditions', 'Tsitsi Dangarembga', 'A coming-of-age story about a young Zimbabwean girl navigating colonialism, education, and family expectations.', 1988, '9780954705275', 'images/covers/nervous_conditions.jpg', 4.2, 250000, 7);

-- Brazil (Country ID: 6) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Dom Casmurro', 'Machado de Assis', 'A psychological novel about jealousy and obsession, considered one of the greatest works of Brazilian literature.', 1899, '9780195103090', 'images/covers/dom_casmurro.jpg', 4.2, 300000, 6),
('The Alchemist', 'Paulo Coelho', 'A philosophical novel about a young shepherds journey to find treasure and discover his personal legend.', 1988, '9780061122415', 'images/covers/alchemist.jpg', 4.1, 2000000, 6),
('Gabriela, Clove and Cinnamon', 'Jorge Amado', 'A novel about love, politics, and social change in 1920s Brazil, centered around the beautiful Gabriela.', 1958, '9780375753786', 'images/covers/gabriela.jpg', 4.3, 400000, 6),
('The Hour of the Star', 'Clarice Lispector', 'A modernist novel about a poor young woman from northeastern Brazil trying to survive in Rio de Janeiro.', 1977, '9780811216874', 'images/covers/hour_star.jpg', 4.0, 200000, 6),
('Dona Flor and Her Two Husbands', 'Jorge Amado', 'A magical realist tale about a woman whose deceased husbands spirit returns to complicate her new marriage.', 1966, '9780380759293', 'images/covers/dona_flor.jpg', 4.2, 350000, 6),
('City of God', 'Paulo Lins', 'A gritty novel about life in Rio de Janeiros favelas, following the rise of organized crime and violence.', 1997, '9780802142009', 'images/covers/city_god.jpg', 4.1, 250000, 6),
('The Passion According to G.H.', 'Clarice Lispector', 'An existential novel about a wealthy womans spiritual crisis after encountering a cockroach.', 1964, '9780811225885', 'images/covers/passion_gh.jpg', 4.0, 150000, 6),
('Captain of the Sands', 'Jorge Amado', 'A novel about a group of street children living in Salvador, Bahia, and their struggles for survival.', 1937, '9780805210477', 'images/covers/captain_sands.jpg', 4.1, 180000, 6);

-- Mexico (Country ID: 10) - adding 8 more books to reach 10
INSERT INTO books (title, author, description, publication_year, isbn, cover_image_url, average_rating, rating_count, country_id) VALUES
('Like Water for Chocolate', 'Laura Esquivel', 'A magical realist novel about a woman who infuses her cooking with emotions, affecting all who eat her food.', 1989, '9780385420174', 'images/covers/water_chocolate.jpg', 4.3, 800000, 10),
('Pedro Paramo', 'Juan Rulfo', 'A haunting novel about a man who travels to his mothers hometown to find his father, only to discover a ghost town.', 1955, '9780802133908', 'images/covers/pedro_paramo.jpg', 4.1, 400000, 10),
('The Labyrinth of Solitude', 'Octavio Paz', 'A philosophical essay exploring Mexican identity and culture through history, mythology, and psychology.', 1950, '9780802150424', 'images/covers/labyrinth_solitude.jpg', 4.2, 300000, 10),
('Under the Volcano', 'Malcolm Lowry', 'A modernist novel set in Mexico about a British consuls final day, exploring themes of alcoholism and despair.', 1947, '9780060956820', 'images/covers/under_volcano.jpg', 4.0, 250000, 10),
('The Death of Artemio Cruz', 'Carlos Fuentes', 'A complex novel about a dying Mexican revolutionary reflecting on his life and the corruption of ideals.', 1962, '9780374522834', 'images/covers/artemio_cruz.jpg', 4.1, 200000, 10),
('Where the Air Is Clear', 'Carlos Fuentes', 'A panoramic novel depicting Mexican society in the 1950s through multiple interconnected characters.', 1958, '9780374289447', 'images/covers/air_clear.jpg', 4.0, 180000, 10),
('The Underdogs', 'Mariano Azuela', 'A novel about the Mexican Revolution told from the perspective of a peasant who joins the revolutionary forces.', 1915, '9780451524935', 'images/covers/underdogs.jpg', 4.1, 150000, 10),
('Aura', 'Carlos Fuentes', 'A gothic novella about a young historian who becomes entranced by a mysterious elderly woman and her niece.', 1962, '9780374520458', 'images/covers/aura.jpg', 4.0, 120000, 10);