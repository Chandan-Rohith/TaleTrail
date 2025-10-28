-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: taletrail_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book_genre_relations`
--

DROP TABLE IF EXISTS `book_genre_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_genre_relations` (
  `book_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`book_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `book_genre_relations_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `book_genre_relations_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `book_genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_genre_relations`
--

LOCK TABLES `book_genre_relations` WRITE;
/*!40000 ALTER TABLE `book_genre_relations` DISABLE KEYS */;
INSERT INTO `book_genre_relations` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(21,1),(4,2),(18,3),(6,4),(5,5),(1,6),(3,6),(8,6),(15,6),(16,6),(17,6),(20,6),(9,7),(12,7),(14,7),(2,8),(13,9),(11,10),(21,10),(6,11),(10,12),(19,12),(20,13),(22,13),(7,19),(22,19);
/*!40000 ALTER TABLE `book_genre_relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_genres`
--

DROP TABLE IF EXISTS `book_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT '#8B1538' COMMENT 'Color for UI display',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_genres`
--

LOCK TABLES `book_genres` WRITE;
/*!40000 ALTER TABLE `book_genres` DISABLE KEYS */;
INSERT INTO `book_genres` VALUES (1,'Fiction','#8B1538','2025-10-02 07:52:22'),(2,'Romance','#E91E63','2025-10-02 07:52:22'),(3,'Mystery','#4A148C','2025-10-02 07:52:22'),(4,'Fantasy','#2E7D32','2025-10-02 07:52:22'),(5,'Science Fiction','#1565C0','2025-10-02 07:52:22'),(6,'Historical Fiction','#BF360C','2025-10-02 07:52:22'),(7,'Contemporary','#F57C00','2025-10-02 07:52:22'),(8,'Literary Fiction','#5D4037','2025-10-02 07:52:22'),(9,'Adventure','#388E3C','2025-10-02 07:52:22'),(10,'Magical Realism','#7B1FA2','2025-10-02 07:52:22'),(11,'Young Adult','#FF4081','2025-10-02 07:52:22'),(12,'Classic','#8D6E63','2025-10-02 07:52:22'),(13,'Biography','#616161','2025-10-02 07:52:22'),(14,'Poetry','#AD1457','2025-10-02 07:52:22'),(15,'Drama','#C62828','2025-10-02 07:52:22'),(16,'Thriller','#1A237E','2025-10-02 07:52:22'),(17,'Horror','#212121','2025-10-02 07:52:22'),(18,'Comedy','#FF9800','2025-10-02 07:52:22'),(19,'Philosophy','#455A64','2025-10-02 07:52:22'),(20,'Travel','#00ACC1','2025-10-02 07:52:22');
/*!40000 ALTER TABLE `book_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `book_stats`
--

DROP TABLE IF EXISTS `book_stats`;
/*!50001 DROP VIEW IF EXISTS `book_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `book_stats` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `author`,
 1 AS `average_rating`,
 1 AS `rating_count`,
 1 AS `country_name`,
 1 AS `country_code`,
 1 AS `unique_viewers`,
 1 AS `favorites_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `publication_year` int DEFAULT NULL,
  `isbn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `cover_image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `rating_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_country` (`country_id`),
  KEY `idx_rating` (`average_rating`),
  KEY `idx_author` (`author`),
  KEY `idx_title` (`title`),
  KEY `idx_books_country_rating` (`country_id`,`average_rating` DESC),
  FULLTEXT KEY `idx_search` (`title`,`author`,`description`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'To Kill a Mockingbird','Harper Lee','A gripping, heart-wrenching tale of racial injustice and lost innocence in the American South. Through the eyes of Scout Finch, we witness the moral complexity of human nature in a story that continues to resonate with readers worldwide.',1960,'9780061120084',1,'images/covers/mockingbird.jpg',4.30,2847,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(2,'The Great Gatsby','F. Scott Fitzgerald','A dazzling critique of the American Dream set in the jazz-soaked 1920s. Gatsby\'s tragic pursuit of love and status unfolds in a world of glittering parties and dark secrets, painted in Fitzgerald\'s luminous prose.',1925,'9780743273565',1,'images/covers/great-gatsby.jpg',3.90,1923,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(3,'Beloved','Toni Morrison','A haunting masterpiece that confronts the brutal legacy of slavery through the story of Sethe and her daughter Denver. Morrison\'s lyrical prose weaves together memory, trauma, and redemption in unforgettable fashion.',1987,'9781400033416',1,'images/covers/beloved.jpg',4.10,1456,'2025-10-02 07:52:22','2025-10-02 10:58:04'),(4,'Pride and Prejudice','Jane Austen','Witty, romantic, and endlessly quotable - Austen\'s masterpiece sparkles with social commentary and unforgettable characters. Elizabeth Bennet and Mr. Darcy\'s love story remains as captivating today as it was 200 years ago.',1813,'9780141439518',2,'images/covers/pride-prejudice.jpg',4.20,3421,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(5,'1984','George Orwell','A chilling prophecy of totalitarian control that feels frighteningly relevant today. Winston Smith\'s rebellion against Big Brother in a world of surveillance and thought-crime will leave you questioning the nature of truth and freedom.',1949,'9780451524935',2,'images/covers/1984.jpg',4.00,2876,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(6,'Harry Potter and the Philosopher\'s Stone','J.K. Rowling','Step into a world of magic, friendship, and wonder as Harry Potter discovers his destiny at Hogwarts School of Witchcraft and Wizardry. A beloved tale that ignited imagination in millions of readers across the globe.',1997,'9780747532699',2,'images/covers/harry-potter.jpg',4.40,4562,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(7,'The Little Prince','Antoine de Saint-Exup├⌐ry','A philosophical fairy tale that speaks to the child in every adult. Through the eyes of a little prince from another planet, we discover profound truths about love, friendship, and what truly matters in life.',1943,'9780156012195',3,'images/covers/little-prince.jpg',4.30,2134,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(8,'Les Mis├⌐rables','Victor Hugo','An epic tale of redemption set against the tumultuous backdrop of 19th-century France. Jean Valjean\'s journey from convict to saint unfolds in Hugo\'s sweeping narrative of love, sacrifice, and social justice.',1862,'9780451419439',3,'images/covers/les-miserables.jpg',4.20,1876,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(9,'Norwegian Wood','Haruki Murakami','A melancholic coming-of-age story set in 1960s Tokyo, painted in Murakami\'s signature dreamy prose. Toru Watanabe navigates love, loss, and the complexities of growing up in this beautiful and haunting novel.',1987,'9780375704024',4,'images/covers/norwegian-wood.jpg',3.90,1654,'2025-10-02 07:52:22','2025-10-02 10:58:04'),(10,'The Tale of Genji','Murasaki Shikibu','Often considered the world\'s first novel, this 11th-century masterpiece follows the romantic adventures of Prince Genji in the Japanese imperial court. A timeless exploration of love, beauty, and the fleeting nature of life.',1010,'9780140437148',4,'images/covers/tale-of-genji.jpg',3.80,892,'2025-10-02 07:52:22','2025-10-02 11:15:43'),(11,'Midnight\'s Children','Salman Rushdie','A magical realist epic that mirrors the birth of modern India through the extraordinary life of Saleem Sinai. Born at the stroke of midnight on India\'s independence, Saleem\'s story weaves personal and political history into a dazzling tapestry.',1981,'9780812976533',5,'images/covers/midnight-children.jpg',4.00,1543,'2025-10-02 07:52:22','2025-10-02 11:09:52'),(12,'The God of Small Things','Arundhati Roy','A lush, sensuous novel about childhood, forbidden love, and the tragic consequences of breaking social taboos. Set in Kerala, Roy\'s debut novel won the Booker Prize for its beautiful and heartbreaking storytelling.',1997,'9780812979657',5,'images/covers/god-small-things.jpg',3.80,1287,'2025-10-02 07:52:22','2025-10-02 10:58:04'),(13,'The Alchemist','Paulo Coelho','A inspiring fable about following your dreams and listening to your heart. Santiago\'s journey from Spain to Egypt in search of treasure becomes a spiritual quest that has touched millions of readers worldwide.',1988,'9780061122415',6,'images/covers/alchemist.jpg',3.90,3245,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(14,'City of God','Paulo Lins','A raw, powerful portrayal of life in Rio de Janeiro\'s favelas, told with unflinching honesty and surprising beauty. This semi-autobiographical novel exposes the harsh realities of poverty and violence while celebrating human resilience.',1997,'9780802139122',6,'images/covers/city-of-god.jpg',4.10,967,'2025-10-02 07:52:22','2025-10-02 11:15:43'),(15,'Things Fall Apart','Chinua Achebe','A powerful exploration of colonialism\'s impact on traditional African society through the story of Okonkwo, a proud Igbo warrior. Achebe\'s masterpiece gives voice to African experience and challenges Western narratives about the continent.',1958,'9780385474542',7,'images/covers/things-fall-apart.jpg',3.90,2134,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(16,'Half of a Yellow Sun','Chimamanda Ngozi Adichie','Set during the Nigerian Civil War, this emotionally devastating novel follows three characters whose lives are forever changed by conflict. Adichie\'s masterful storytelling illuminates a dark chapter in African history.',2006,'9781400044160',7,'images/covers/half-yellow-sun.jpg',4.30,1543,'2025-10-02 07:52:22','2025-10-02 10:58:04'),(17,'War and Peace','Leo Tolstoy','An epic masterpiece that follows Russian society during the Napoleonic Wars. Through the intertwined lives of aristocratic families, Tolstoy creates a vast panorama of human experience, exploring themes of love, war, and destiny.',1869,'9780199232765',8,'images/covers/war-peace.jpg',4.10,1876,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(18,'Crime and Punishment','Fyodor Dostoevsky','A psychological thriller that delves deep into the mind of Raskolnikov, a poor student who commits murder and must confront the consequences. A profound exploration of guilt, redemption, and the human soul.',1866,'9780486415871',8,'images/covers/crime-punishment.jpg',4.20,2098,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(19,'Dream of the Red Chamber','Cao Xueqin','One of China\'s Four Great Classical Novels, this epic follows the rise and decline of the wealthy Jia family. A masterwork of Chinese literature that combines romance, philosophy, and social commentary.',1791,'9780140442939',9,'images/covers/dream-red-chamber.jpg',4.00,743,'2025-10-02 07:52:22','2025-10-02 11:15:43'),(20,'Wild Swans','Jung Chang','Three generations of women in 20th-century China, from the last emperor to Mao\'s Cultural Revolution. Chang\'s family memoir reads like an epic novel, offering intimate insights into China\'s tumultuous modern history.',1991,'9780743246989',9,'images/covers/wild-swans.jpg',2.00,1,'2025-10-02 07:52:22','2025-10-02 10:52:26'),(21,'Like Water for Chocolate','Laura Esquivel','A magical realist tale of love, food, and family set during the Mexican Revolution. Tita\'s emotions infuse her cooking with supernatural powers in this sensuous celebration of Mexican culture and cuisine.',1989,'9780385420174',10,'images/covers/like-water-chocolate.jpg',3.80,1432,'2025-10-02 07:52:22','2025-10-02 11:09:52'),(22,'The Labyrinth of Solitude','Octavio Paz','A profound meditation on Mexican identity, culture, and history by the Nobel Prize-winning poet. Paz explores what it means to be Mexican in this influential work of cultural criticism and philosophy.',1950,'9780802150424',10,'images/covers/labyrinth-solitude.jpg',4.10,892,'2025-10-02 07:52:22','2025-10-02 11:15:43'),(23,'Pride and Prejudice','Jane Austen','A witty and romantic tale of Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations in Regency England.',1813,'9780141439518',2,'images/covers/pride_prejudice.jpg',4.60,2500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(24,'Lord of the Rings','J.R.R. Tolkien','An epic fantasy adventure following Frodo Baggins as he journeys to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.',1954,'9780547928227',2,'images/covers/lord_rings.jpg',5.00,1,'2025-10-02 13:50:46','2025-10-06 03:08:00'),(25,'Sherlock Holmes','Arthur Conan Doyle','The complete adventures of the worlds greatest detective and his loyal companion Dr. Watson solving mysteries in Victorian London.',1887,'9780553212419',2,'images/covers/sherlock_holmes.jpg',4.50,1200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(26,'Jane Eyre','Charlotte Bronte','The story of an orphaned girl who becomes a governess and falls in love with her mysterious employer, Mr. Rochester.',1847,'9780141441146',2,'images/covers/jane_eyre.jpg',4.40,950000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(27,'Animal Farm','George Orwell','A satirical allegory about farm animals who rebel against their human farmer, hoping to create a society where animals can be equal, free, and happy.',1945,'9780451526342',2,'images/covers/animal_farm.jpg',4.30,1100000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(28,'Wuthering Heights','Emily Bronte','A passionate tale of love and revenge set on the Yorkshire moors, following the turbulent relationship between Heathcliff and Catherine.',1847,'9780141439556',2,'images/covers/wuthering_heights.jpg',4.20,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(29,'The Chronicles of Narnia','C.S. Lewis','A magical series beginning with four children who discover a wardrobe that leads to the enchanted land of Narnia.',1950,'9780060764890',2,'images/covers/chronicles_narnia.jpg',4.50,1300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(30,'The Catcher in the Rye','J.D. Salinger','The story of teenager Holden Caulfields alienation and rebellion as he wanders New York City after being expelled from prep school.',1951,'9780316769174',1,'images/covers/catcher_rye.jpg',2.00,1,'2025-10-02 13:50:46','2025-10-07 07:55:55'),(31,'Gone with the Wind','Margaret Mitchell','An epic historical romance set during the American Civil War and Reconstruction era, following the strong-willed Scarlett OHara.',1936,'9781451635621',1,'images/covers/gone_wind.jpg',4.30,1200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(32,'The Adventures of Huckleberry Finn','Mark Twain','The adventures of a young boy and an escaped slave as they travel down the Mississippi River on a raft.',1884,'9780486280615',1,'images/covers/huck_finn.jpg',4.20,900000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(33,'Of Mice and Men','John Steinbeck','A tragic tale of friendship between two displaced migrant ranch workers during the Great Depression in California.',1937,'9780140177398',1,'images/covers/mice_men.jpg',4.00,1100000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(34,'The Grapes of Wrath','John Steinbeck','The story of the Joad familys journey from Oklahoma to California during the Great Depression.',1939,'9780143039433',1,'images/covers/grapes_wrath.jpg',4.40,850000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(35,'Moby Dick','Herman Melville','The epic tale of Captain Ahabs obsessive quest for revenge against the white whale that destroyed his leg.',1851,'9780142437247',1,'images/covers/moby_dick.jpg',4.10,700000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(36,'The Scarlet Letter','Nathaniel Hawthorne','Set in Puritan New England, the story follows Hester Prynne as she struggles with the consequences of adultery.',1850,'9780142437261',1,'images/covers/scarlet_letter.jpg',4.00,650000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(37,'Les Miserables','Victor Hugo','An epic tale of redemption and social justice following ex-convict Jean Valjean in 19th-century France.',1862,'9780451419439',3,'images/covers/les_miserables.jpg',4.50,1300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(38,'The Count of Monte Cristo','Alexandre Dumas','A tale of betrayal, imprisonment, escape, and revenge set in early 19th-century France and Italy.',1844,'9780140449266',3,'images/covers/monte_cristo.jpg',4.60,1100000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(39,'Madame Bovary','Gustave Flaubert','The story of Emma Bovary, a doctors wife who seeks escape from her mundane provincial life through romantic fantasies and affairs.',1857,'9780143106494',3,'images/covers/madame_bovary.jpg',4.10,750000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(40,'The Stranger','Albert Camus','The story of Meursault, a man who seems indifferent to his own life and the world around him, exploring themes of existentialism.',1942,'9780679720201',3,'images/covers/the_stranger.jpg',4.20,900000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(41,'In Search of Lost Time','Marcel Proust','A monumental work exploring memory, time, and art through the narrators recollections of his past.',1913,'9780375751538',3,'images/covers/lost_time.jpg',4.30,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(42,'Candide','Voltaire','A satirical novella that follows the misadventures of Candide, a young man who believes in philosophical optimism.',1759,'9780486266893',3,'images/covers/candide.jpg',4.00,500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(43,'The Three Musketeers','Alexandre Dumas','The adventures of dArtagnan and his friends Athos, Porthos, and Aramis in 17th-century France.',1844,'9780140449341',3,'images/covers/three_musketeers.jpg',4.40,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(44,'Nausea','Jean-Paul Sartre','A philosophical novel exploring existentialism through the experiences of Antoine Roquentin.',1938,'9780811220309',3,'images/covers/nausea.jpg',4.00,350000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(45,'Crime and Punishment','Fyodor Dostoevsky','A psychological thriller about a poor student who commits murder and struggles with guilt and redemption.',1866,'9780486415871',8,'images/covers/crime_punishment.jpg',4.50,1200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(46,'Anna Karenina','Leo Tolstoy','A complex novel exploring love, family, and society through the tragic story of Anna Karenina and her affair with Count Vronsky.',1877,'9780143035008',8,'images/covers/anna_karenina.jpg',4.40,1000000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(47,'The Brothers Karamazov','Fyodor Dostoevsky','A philosophical novel exploring faith, doubt, and morality through the story of three brothers and their fathers murder.',1880,'9780374528379',8,'images/covers/brothers_karamazov.jpg',4.60,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(48,'Doctor Zhivago','Boris Pasternak','An epic romance set during the Russian Revolution, following poet Yuri Zhivago through love and political upheaval.',1957,'9780307390950',8,'images/covers/doctor_zhivago.jpg',4.30,650000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(49,'One Day in the Life of Ivan Denisovich','Aleksandr Solzhenitsyn','A powerful depiction of life in a Soviet labor camp, following prisoner Ivan Denisovich through a single day.',1962,'9780451228147',8,'images/covers/ivan_denisovich.jpg',4.20,550000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(50,'The Master and Margarita','Mikhail Bulgakov','A fantastical novel blending satire, philosophy, and the supernatural as the Devil visits Soviet Moscow.',1967,'9780679760801',8,'images/covers/master_margarita.jpg',4.40,700000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(51,'Eugene Onegin','Alexander Pushkin','A novel in verse about a bored aristocrat and his tragic relationship with the innocent Tatyana.',1833,'9780140448108',8,'images/covers/eugene_onegin.jpg',4.10,450000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(52,'Dead Souls','Nikolai Gogol','A satirical novel about Pavel Chichikovs scheme to buy dead serfs names to gain social status.',1842,'9780375760082',8,'images/covers/dead_souls.jpg',4.00,350000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(53,'The Mahabharata','Vyasa','An ancient Indian epic telling the story of the Kurukshetra War and the fates of the Kaurava and Pandava princes.',-400,'9780226846637',5,'images/covers/mahabharata.jpg',4.70,500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(54,'The God of Small Things','Arundhati Roy','A haunting story of an Indian family, exploring love, loss, and the rigid caste system in Kerala.',1997,'9780812979657',5,'images/covers/god_small_things.jpg',4.30,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(55,'Midnights Children','Salman Rushdie','A magical realist novel following Saleem Sinai, whose life parallels the partition and independence of India.',1981,'9780812976533',5,'images/covers/midnights_children.jpg',4.20,650000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(56,'A Suitable Boy','Vikram Seth','An epic novel set in 1950s India, following four families and the search for a suitable husband for Lata.',1993,'9780060926212',5,'images/covers/suitable_boy.jpg',4.40,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(57,'The White Tiger','Aravind Adiga','A darkly comic novel about Balram Halwais rise from rural poverty to entrepreneurial success in modern India.',2008,'9781416562603',5,'images/covers/white_tiger.jpg',4.10,550000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(58,'Shantaram','Gregory David Roberts','The story of an escaped convict who flees to Bombay and becomes involved in the citys underworld.',2003,'9780312330538',5,'images/covers/shantaram.jpg',4.30,750000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(59,'The Rozabal Line','Ashwin Sanghi','A thriller combining history, religion, and conspiracy theories about Jesus Christs possible survival and journey to India.',2007,'9788192328454',5,'images/covers/rozabal_line.jpg',4.00,300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(60,'Sacred Games','Vikram Chandra','A epic crime novel set in Mumbai, following police inspector Sartaj Singh and gangster Ganesh Gaitonde.',2006,'9780060796785',5,'images/covers/sacred_games.jpg',4.20,450000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(61,'The Tale of Genji','Murasaki Shikibu','Considered the worlds first novel, following Prince Genjis romantic adventures in Heian-era Japan.',1010,'9780143039495',4,'images/covers/tale_genji.jpg',4.30,200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(62,'Kafka on the Shore','Haruki Murakami','A surreal novel following a teenage runaway and an elderly man who can talk to cats in contemporary Japan.',2002,'9781400079278',4,'images/covers/kafka_shore.jpg',4.40,900000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(63,'The Wind-Up Bird Chronicle','Haruki Murakami','A mysterious novel about a man searching for his missing wife and cat in suburban Tokyo.',1994,'9780679775430',4,'images/covers/windup_bird.jpg',4.20,650000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(64,'Snow Country','Yasunari Kawabata','A lyrical novel about a Tokyo dilettantes affair with a geisha in a remote hot-spring town.',1948,'9780679761044',4,'images/covers/snow_country.jpg',4.10,300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(65,'The Book of Tea','Kakuzo Okakura','A classic work on Japanese tea ceremony and its philosophical significance in Eastern culture.',1906,'9784805311943',4,'images/covers/book_tea.jpg',4.00,150000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(66,'Battle Royale','Koushun Takami','A dystopian thriller about students forced to fight to the death on a remote island.',1999,'9781421565989',4,'images/covers/battle_royale.jpg',4.30,500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(67,'The Sailor Who Fell from Grace with the Sea','Yukio Mishima','A haunting novel about a widow, her sailor lover, and her sons disturbing gang of friends.',1963,'9780679750154',4,'images/covers/sailor_grace.jpg',4.10,250000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(68,'Kitchen','Banana Yoshimoto','A touching novella about grief, family, and finding comfort in unexpected places.',1988,'9780802142443',4,'images/covers/kitchen.jpg',4.00,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(69,'Journey to the West','Wu Chengen','A classic Chinese novel following the Monkey King and his companions on their pilgrimage to obtain Buddhist scriptures.',1592,'9780226971322',9,'images/covers/journey_west.jpg',4.50,600000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(70,'Dream of the Red Chamber','Cao Xueqin','An 18th-century Chinese novel depicting the rise and fall of a wealthy family during the Qing Dynasty.',1791,'9780140442933',9,'images/covers/red_chamber.jpg',4.40,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(71,'Wild Swans','Jung Chang','A family memoir spanning three generations of Chinese women through the tumultuous 20th century.',1991,'9780743246989',9,'images/covers/wild_swans.jpg',4.60,750000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(72,'The Good Earth','Pearl S. Buck','The story of Wang Lung, a Chinese farmer, and his rise from poverty to wealth in early 20th-century China.',1931,'9780743272957',9,'images/covers/good_earth.jpg',4.30,500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(73,'Red Sorghum','Mo Yan','A multigenerational saga set in rural China during the Second Sino-Japanese War.',1987,'9780140168952',9,'images/covers/red_sorghum.jpg',4.20,350000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(74,'Balzac and the Little Chinese Seamstress','Dai Sijie','A coming-of-age story about two young men sent to a remote village during Chinas Cultural Revolution.',2000,'9780385722209',9,'images/covers/balzac_seamstress.jpg',4.10,300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(75,'Wolf Totem','Jiang Rong','A semi-autobiographical novel about a young intellectual sent to Inner Mongolia during the Cultural Revolution.',2004,'9780143115144',9,'images/covers/wolf_totem.jpg',4.00,250000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(76,'The Three-Body Problem','Liu Cixin','A hard science fiction novel about humanitys first contact with an alien civilization.',2006,'9780765382030',9,'images/covers/three_body.jpg',4.40,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(77,'Purple Hibiscus','Chimamanda Ngozi Adichie','A coming-of-age story about a young Nigerian girl discovering her voice amidst family turmoil and political unrest.',2003,'9781616202415',7,'images/covers/purple_hibiscus.jpg',4.40,500000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(78,'Half of a Yellow Sun','Chimamanda Ngozi Adichie','A powerful novel about the Nigerian Civil War and its impact on the lives of several characters.',2006,'9780007200283',7,'images/covers/yellow_sun.jpg',4.50,600000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(79,'The Joys of Motherhood','Buchi Emecheta','The story of Nnu Ego, a Nigerian woman struggling with motherhood and changing traditions in colonial Nigeria.',1979,'9780807616214',7,'images/covers/joys_motherhood.jpg',4.20,200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(80,'Americanah','Chimamanda Ngozi Adichie','A novel about a young Nigerian woman who travels to America for university and grapples with identity and belonging.',2013,'9780307455925',7,'images/covers/americanah.jpg',4.30,750000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(81,'The Beautiful Ones Are Not Yet Born','Ayi Kwei Armah','A novel about corruption and moral decay in post-independence Ghana, relevant to broader African experiences.',1968,'9780435905200',7,'images/covers/beautiful_ones.jpg',4.10,150000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(82,'So Long a Letter','Mariama Ba','A powerful epistolary novel about a Senegalese woman reflecting on her life, marriage, and friendship.',1979,'9780435905201',7,'images/covers/long_letter.jpg',4.30,180000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(83,'The Palm-Wine Drinkard','Amos Tutuola','A fantastical novel rooted in Yoruba folklore about a mans journey to find his deceased palm-wine tapster.',1952,'9780802151902',7,'images/covers/palm_wine.jpg',4.00,120000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(84,'Nervous Conditions','Tsitsi Dangarembga','A coming-of-age story about a young Zimbabwean girl navigating colonialism, education, and family expectations.',1988,'9780954705275',7,'images/covers/nervous_conditions.jpg',4.20,250000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(85,'Dom Casmurro','Machado de Assis','A psychological novel about jealousy and obsession, considered one of the greatest works of Brazilian literature.',1899,'9780195103090',6,'images/covers/dom_casmurro.jpg',4.20,300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(86,'The Alchemist','Paulo Coelho','A philosophical novel about a young shepherds journey to find treasure and discover his personal legend.',1988,'9780061122415',6,'images/covers/alchemist.jpg',5.00,1,'2025-10-02 13:50:46','2025-10-07 07:56:42'),(87,'Gabriela, Clove and Cinnamon','Jorge Amado','A novel about love, politics, and social change in 1920s Brazil, centered around the beautiful Gabriela.',1958,'9780375753786',6,'images/covers/gabriela.jpg',4.30,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(88,'The Hour of the Star','Clarice Lispector','A modernist novel about a poor young woman from northeastern Brazil trying to survive in Rio de Janeiro.',1977,'9780811216874',6,'images/covers/hour_star.jpg',4.00,200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(89,'Dona Flor and Her Two Husbands','Jorge Amado','A magical realist tale about a woman whose deceased husbands spirit returns to complicate her new marriage.',1966,'9780380759293',6,'images/covers/dona_flor.jpg',4.20,350000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(90,'City of God','Paulo Lins','A gritty novel about life in Rio de Janeiros favelas, following the rise of organized crime and violence.',1997,'9780802142009',6,'images/covers/city_god.jpg',4.10,250000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(91,'The Passion According to G.H.','Clarice Lispector','An existential novel about a wealthy womans spiritual crisis after encountering a cockroach.',1964,'9780811225885',6,'images/covers/passion_gh.jpg',4.00,150000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(92,'Captain of the Sands','Jorge Amado','A novel about a group of street children living in Salvador, Bahia, and their struggles for survival.',1937,'9780805210477',6,'images/covers/captain_sands.jpg',4.10,180000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(93,'Like Water for Chocolate','Laura Esquivel','A magical realist novel about a woman who infuses her cooking with emotions, affecting all who eat her food.',1989,'9780385420174',10,'images/covers/water_chocolate.jpg',4.30,800000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(94,'Pedro Paramo','Juan Rulfo','A haunting novel about a man who travels to his mothers hometown to find his father, only to discover a ghost town.',1955,'9780802133908',10,'images/covers/pedro_paramo.jpg',4.10,400000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(95,'The Labyrinth of Solitude','Octavio Paz','A philosophical essay exploring Mexican identity and culture through history, mythology, and psychology.',1950,'9780802150424',10,'images/covers/labyrinth_solitude.jpg',4.20,300000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(96,'Under the Volcano','Malcolm Lowry','A modernist novel set in Mexico about a British consuls final day, exploring themes of alcoholism and despair.',1947,'9780060956820',10,'images/covers/under_volcano.jpg',4.00,250000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(97,'The Death of Artemio Cruz','Carlos Fuentes','A complex novel about a dying Mexican revolutionary reflecting on his life and the corruption of ideals.',1962,'9780374522834',10,'images/covers/artemio_cruz.jpg',4.10,200000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(98,'Where the Air Is Clear','Carlos Fuentes','A panoramic novel depicting Mexican society in the 1950s through multiple interconnected characters.',1958,'9780374289447',10,'images/covers/air_clear.jpg',4.00,180000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(99,'The Underdogs','Mariano Azuela','A novel about the Mexican Revolution told from the perspective of a peasant who joins the revolutionary forces.',1915,'9780451524935',10,'images/covers/underdogs.jpg',4.10,150000,'2025-10-02 13:50:46','2025-10-02 13:50:46'),(100,'Aura','Carlos Fuentes','A gothic novella about a young historian who becomes entranced by a mysterious elderly woman and her niece.',1962,'9780374520458',10,'images/covers/aura.jpg',4.00,120000,'2025-10-02 13:50:46','2025-10-02 13:50:46');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordinates` json DEFAULT NULL COMMENT 'Latitude and longitude for map display',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'United States','US','{\"lat\": 39.8283, \"lng\": -98.5795}','2025-10-02 07:52:22'),(2,'United Kingdom','GB','{\"lat\": 55.3781, \"lng\": -3.436}','2025-10-02 07:52:22'),(3,'France','FR','{\"lat\": 46.2276, \"lng\": 2.2137}','2025-10-02 07:52:22'),(4,'Japan','JP','{\"lat\": 36.2048, \"lng\": 138.2529}','2025-10-02 07:52:22'),(5,'India','IN','{\"lat\": 20.5937, \"lng\": 78.9629}','2025-10-02 07:52:22'),(6,'Brazil','BR','{\"lat\": -14.235, \"lng\": -51.9253}','2025-10-02 07:52:22'),(7,'Nigeria','NG','{\"lat\": 9.082, \"lng\": 8.6753}','2025-10-02 07:52:22'),(8,'Russia','RU','{\"lat\": 61.524, \"lng\": 105.3188}','2025-10-02 07:52:22'),(9,'China','CN','{\"lat\": 35.8617, \"lng\": 104.1954}','2025-10-02 07:52:22'),(10,'Mexico','MX','{\"lat\": 23.6345, \"lng\": -102.5528}','2025-10-02 07:52:22'),(11,'Egypt','EG','{\"lat\": 26.0975, \"lng\": 30.0444}','2025-10-02 07:52:22'),(12,'South Africa','ZA','{\"lat\": -30.5595, \"lng\": 22.9375}','2025-10-02 07:52:22'),(13,'Australia','AU','{\"lat\": -25.2744, \"lng\": 133.7751}','2025-10-02 07:52:22'),(14,'Argentina','AR','{\"lat\": -38.4161, \"lng\": -63.6167}','2025-10-02 07:52:22'),(15,'Colombia','CO','{\"lat\": 4.5709, \"lng\": -74.2973}','2025-10-02 07:52:22'),(16,'Turkey','TR','{\"lat\": 38.9637, \"lng\": 35.2433}','2025-10-02 07:52:22'),(17,'Kenya','KE','{\"lat\": -0.0236, \"lng\": 37.9062}','2025-10-02 07:52:22'),(18,'Thailand','TH','{\"lat\": 15.87, \"lng\": 100.9925}','2025-10-02 07:52:22'),(19,'Italy','IT','{\"lat\": 41.8719, \"lng\": 12.5674}','2025-10-02 07:52:22'),(20,'Spain','ES','{\"lat\": 40.4637, \"lng\": -3.7492}','2025-10-02 07:52:22');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_book` (`user_id`,`book_id`),
  KEY `idx_book_rating` (`book_id`,`rating`),
  KEY `idx_user_rating` (`user_id`,`rating`),
  KEY `idx_created` (`created_at`),
  KEY `idx_ratings_recent` (`created_at` DESC),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,1,1,5,'An absolute masterpiece! Harper Lee created characters that feel like real people, and the story tackles difficult themes with grace and wisdom. A must-read for everyone.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(2,1,6,5,'Magical! J.K. Rowling created a world so vivid and enchanting that I never wanted to leave Hogwarts. The perfect blend of adventure, friendship, and wonder.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(3,2,2,4,'Fitzgerald\'s prose is absolutely beautiful, like poetry. The story is tragic but compelling, and it really captures the excess and emptiness of the Jazz Age.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(4,2,4,5,'Jane Austen\'s wit is unmatched! Elizabeth Bennet is such a strong, intelligent heroine. The romance with Darcy is perfectly developed - slow burn at its finest.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(5,3,11,4,'Rushdie\'s magical realism is incredible. The way he weaves Indian history with Saleem\'s personal story is masterful. Dense but rewarding.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(6,3,7,5,'This book touched my heart in ways I didn\'t expect. So simple yet so profound. The little prince\'s observations about adults are both funny and deeply true.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(7,4,13,3,'Beautiful message about following your dreams, though the writing felt a bit preachy at times. Still, it\'s an inspiring read that stays with you.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(8,4,15,4,'Achebe gives such an important perspective on colonialism. Okonkwo is a complex character - flawed but human. The ending is heartbreaking.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(9,5,5,5,'Terrifyingly relevant today! Orwell\'s vision of surveillance and thought control feels prophetic. Big Brother is watching, and it\'s scarier than ever.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(10,5,21,4,'What a unique way to tell a story! The recipes and magical elements blend perfectly. Made me want to cook and fall in love at the same time.','2025-10-02 07:52:22','2025-10-02 07:52:22'),(11,7,20,2,'nice','2025-10-02 10:33:14','2025-10-02 10:33:14'),(15,7,24,5,'10gey','2025-10-06 03:08:00','2025-10-06 03:08:00'),(16,8,30,2,NULL,'2025-10-07 07:55:55','2025-10-07 07:55:55'),(19,8,86,5,'good','2025-10-07 07:56:47','2025-10-07 07:56:47');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `trending_books`
--

DROP TABLE IF EXISTS `trending_books`;
/*!50001 DROP VIEW IF EXISTS `trending_books`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `trending_books` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `author`,
 1 AS `description`,
 1 AS `publication_year`,
 1 AS `isbn`,
 1 AS `country_id`,
 1 AS `cover_image_url`,
 1 AS `average_rating`,
 1 AS `rating_count`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `country_name`,
 1 AS `country_code`,
 1 AS `recent_interactions`,
 1 AS `recent_avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_favorite` (`user_id`,`book_id`),
  KEY `book_id` (`book_id`),
  KEY `idx_user_favorites` (`user_id`,`created_at`),
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorites`
--

LOCK TABLES `user_favorites` WRITE;
/*!40000 ALTER TABLE `user_favorites` DISABLE KEYS */;
INSERT INTO `user_favorites` VALUES (1,1,1,'2025-10-02 07:52:22'),(2,1,6,'2025-10-02 07:52:22'),(3,2,2,'2025-10-02 07:52:22'),(4,3,7,'2025-10-02 07:52:22'),(5,5,5,'2025-10-02 07:52:22');
/*!40000 ALTER TABLE `user_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_interactions`
--

DROP TABLE IF EXISTS `user_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_interactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `interaction_type` enum('view','rating','favorite','share') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_book_interaction` (`user_id`,`book_id`,`interaction_type`),
  KEY `idx_user_interactions` (`user_id`,`created_at`),
  KEY `idx_book_interactions` (`book_id`,`created_at`),
  KEY `idx_interaction_type` (`interaction_type`),
  KEY `idx_interactions_recent` (`created_at` DESC),
  CONSTRAINT `user_interactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_interactions_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_interactions`
--

LOCK TABLES `user_interactions` WRITE;
/*!40000 ALTER TABLE `user_interactions` DISABLE KEYS */;
INSERT INTO `user_interactions` VALUES (1,1,1,'view','2025-10-02 07:52:22'),(2,1,1,'rating','2025-10-02 07:52:22'),(3,1,1,'favorite','2025-10-02 07:52:22'),(4,1,4,'view','2025-10-02 07:52:22'),(5,1,4,'rating','2025-10-02 07:52:22'),(6,1,6,'view','2025-10-02 07:52:22'),(7,1,6,'rating','2025-10-02 07:52:22'),(8,1,6,'favorite','2025-10-02 07:52:22'),(9,1,8,'view','2025-10-02 07:52:22'),(10,1,10,'view','2025-10-02 07:52:22'),(11,2,2,'view','2025-10-02 07:52:22'),(12,2,2,'rating','2025-10-02 07:52:22'),(13,2,2,'favorite','2025-10-02 07:52:22'),(14,2,3,'view','2025-10-02 07:52:22'),(15,2,4,'view','2025-10-02 07:52:22'),(16,2,4,'rating','2025-10-02 07:52:22'),(17,2,17,'view','2025-10-02 07:52:22'),(18,3,11,'view','2025-10-02 07:52:22'),(19,3,11,'rating','2025-10-02 07:52:22'),(20,3,7,'view','2025-10-02 07:52:22'),(21,3,7,'rating','2025-10-02 07:52:22'),(22,3,7,'favorite','2025-10-02 07:52:22'),(23,3,9,'view','2025-10-02 07:52:22'),(24,3,12,'view','2025-10-02 07:52:22'),(25,3,21,'view','2025-10-02 07:52:22'),(26,4,13,'view','2025-10-02 07:52:22'),(27,4,13,'rating','2025-10-02 07:52:22'),(28,4,15,'view','2025-10-02 07:52:22'),(29,4,15,'rating','2025-10-02 07:52:22'),(30,4,16,'view','2025-10-02 07:52:22'),(31,4,14,'view','2025-10-02 07:52:22'),(32,5,5,'view','2025-10-02 07:52:22'),(33,5,5,'rating','2025-10-02 07:52:22'),(34,5,5,'favorite','2025-10-02 07:52:22'),(35,5,1,'view','2025-10-02 07:52:22'),(36,5,21,'view','2025-10-02 07:52:22'),(37,5,21,'rating','2025-10-02 07:52:22'),(38,5,22,'view','2025-10-02 07:52:22'),(39,7,6,'view','2025-10-02 08:57:04'),(40,7,5,'view','2025-10-02 10:32:41'),(41,7,20,'view','2025-10-02 10:33:15'),(42,7,20,'rating','2025-10-02 10:33:14'),(50,7,7,'view','2025-10-02 13:22:33'),(51,7,13,'view','2025-10-02 13:22:41'),(52,7,4,'view','2025-10-02 13:46:09'),(53,7,86,'view','2025-10-07 07:38:53'),(55,7,31,'view','2025-10-02 17:46:09'),(56,7,1,'view','2025-10-06 03:49:06'),(57,7,36,'view','2025-10-02 17:46:33'),(58,7,24,'view','2025-10-06 03:08:01'),(59,7,24,'rating','2025-10-06 03:08:00'),(64,7,29,'view','2025-10-06 04:17:26'),(65,7,2,'view','2025-10-07 02:52:47'),(67,7,26,'view','2025-10-07 07:40:41'),(68,8,4,'view','2025-10-07 07:48:00'),(69,8,30,'view','2025-10-07 07:55:56'),(70,8,30,'rating','2025-10-07 07:55:55'),(76,8,86,'view','2025-10-07 07:56:48'),(77,8,86,'rating','2025-10-07 07:56:47'),(86,8,45,'view','2025-10-07 08:16:56'),(88,8,26,'view','2025-10-07 08:24:18');
/*!40000 ALTER TABLE `user_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bookworm_alice','alice@example.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm','2025-10-02 07:52:22','2025-10-02 07:52:22'),(2,'literature_lover','john@example.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm','2025-10-02 07:52:22','2025-10-02 07:52:22'),(3,'global_reader','maria@example.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm','2025-10-02 07:52:22','2025-10-02 07:52:22'),(4,'adventure_seeker','david@example.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm','2025-10-02 07:52:22','2025-10-02 07:52:22'),(5,'story_explorer','sarah@example.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeKMxWpq2r9eEQ.Hm','2025-10-02 07:52:22','2025-10-02 07:52:22'),(6,'test','test@test.com','$2a$12$YD6iWs9tKl5GvRNy1E4YZ.jTrjFB1umM43m9We95qz5duzp85XZY2','2025-10-02 08:44:56','2025-10-02 08:44:56'),(7,'rohith','rohithraj1978@gmail.com','$2a$12$j932e7M2qyl0u1V8/X.F6eMXPC4n46SEOMv4Emvy8mxW5z2yz3SQO','2025-10-02 08:51:42','2025-10-02 08:51:42'),(8,'manaswini','manaswinik2006@gmail.com','$2a$12$vNzw6IJ1CY9X8tG8wZe4huExdVo1BQ5HN6J9U7EudcjUMWlpma1wy','2025-10-07 07:47:43','2025-10-07 07:47:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `book_stats`
--

/*!50001 DROP VIEW IF EXISTS `book_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `book_stats` AS select `b`.`id` AS `id`,`b`.`title` AS `title`,`b`.`author` AS `author`,`b`.`average_rating` AS `average_rating`,`b`.`rating_count` AS `rating_count`,`c`.`name` AS `country_name`,`c`.`code` AS `country_code`,count(distinct `ui`.`user_id`) AS `unique_viewers`,count(distinct `uf`.`user_id`) AS `favorites_count` from (((`books` `b` left join `countries` `c` on((`b`.`country_id` = `c`.`id`))) left join `user_interactions` `ui` on(((`b`.`id` = `ui`.`book_id`) and (`ui`.`interaction_type` = 'view')))) left join `user_favorites` `uf` on((`b`.`id` = `uf`.`book_id`))) group by `b`.`id`,`b`.`title`,`b`.`author`,`b`.`average_rating`,`b`.`rating_count`,`c`.`name`,`c`.`code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `trending_books`
--

/*!50001 DROP VIEW IF EXISTS `trending_books`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `trending_books` AS select `b`.`id` AS `id`,`b`.`title` AS `title`,`b`.`author` AS `author`,`b`.`description` AS `description`,`b`.`publication_year` AS `publication_year`,`b`.`isbn` AS `isbn`,`b`.`country_id` AS `country_id`,`b`.`cover_image_url` AS `cover_image_url`,`b`.`average_rating` AS `average_rating`,`b`.`rating_count` AS `rating_count`,`b`.`created_at` AS `created_at`,`b`.`updated_at` AS `updated_at`,`c`.`name` AS `country_name`,`c`.`code` AS `country_code`,count(`ui`.`id`) AS `recent_interactions`,avg(`r`.`rating`) AS `recent_avg_rating` from (((`books` `b` left join `countries` `c` on((`b`.`country_id` = `c`.`id`))) left join `user_interactions` `ui` on(((`b`.`id` = `ui`.`book_id`) and (`ui`.`created_at` >= (now() - interval 7 day))))) left join `ratings` `r` on(((`b`.`id` = `r`.`book_id`) and (`r`.`created_at` >= (now() - interval 7 day))))) group by `b`.`id` having (`recent_interactions` > 0) order by `recent_interactions` desc,`recent_avg_rating` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 21:58:00
