-- Book Cover Images Update Guide for TaleTrail
-- This script helps you update book cover image paths after downloading images

-- First, let's see all the new books that need cover images:
SELECT id, title, author, cover_image_url 
FROM books 
WHERE cover_image_url LIKE 'images/covers/%' 
ORDER BY country_id, title;

-- Here are the image file names for all the new books you added:
-- Save the images with these exact names in: frontend/images/covers/

-- United Kingdom Books:
-- pride_prejudice.jpg - Pride and Prejudice by Jane Austen
-- lord_rings.jpg - Lord of the Rings by J.R.R. Tolkien  
-- sherlock_holmes.jpg - Sherlock Holmes by Arthur Conan Doyle
-- jane_eyre.jpg - Jane Eyre by Charlotte Brontë
-- animal_farm.jpg - Animal Farm by George Orwell
-- wuthering_heights.jpg - Wuthering Heights by Emily Brontë
-- chronicles_narnia.jpg - The Chronicles of Narnia by C.S. Lewis

-- United States Books:
-- catcher_rye.jpg - The Catcher in the Rye by J.D. Salinger
-- gone_wind.jpg - Gone with the Wind by Margaret Mitchell
-- huck_finn.jpg - The Adventures of Huckleberry Finn by Mark Twain
-- mice_men.jpg - Of Mice and Men by John Steinbeck
-- grapes_wrath.jpg - The Grapes of Wrath by John Steinbeck
-- moby_dick.jpg - Moby Dick by Herman Melville
-- scarlet_letter.jpg - The Scarlet Letter by Nathaniel Hawthorne

-- France Books:
-- les_miserables.jpg - Les Misérables by Victor Hugo
-- monte_cristo.jpg - The Count of Monte Cristo by Alexandre Dumas
-- madame_bovary.jpg - Madame Bovary by Gustave Flaubert
-- the_stranger.jpg - The Stranger by Albert Camus
-- lost_time.jpg - In Search of Lost Time by Marcel Proust
-- candide.jpg - Candide by Voltaire
-- three_musketeers.jpg - The Three Musketeers by Alexandre Dumas
-- nausea.jpg - Nausea by Jean-Paul Sartre

-- Russia Books:
-- crime_punishment.jpg - Crime and Punishment by Fyodor Dostoevsky
-- anna_karenina.jpg - Anna Karenina by Leo Tolstoy
-- brothers_karamazov.jpg - The Brothers Karamazov by Fyodor Dostoevsky
-- doctor_zhivago.jpg - Doctor Zhivago by Boris Pasternak
-- ivan_denisovich.jpg - One Day in the Life of Ivan Denisovich by Aleksandr Solzhenitsyn
-- master_margarita.jpg - The Master and Margarita by Mikhail Bulgakov
-- eugene_onegin.jpg - Eugene Onegin by Alexander Pushkin
-- dead_souls.jpg - Dead Souls by Nikolai Gogol

-- India Books:
-- mahabharata.jpg - The Mahabharata by Vyasa
-- god_small_things.jpg - The God of Small Things by Arundhati Roy
-- midnights_children.jpg - Midnight's Children by Salman Rushdie
-- suitable_boy.jpg - A Suitable Boy by Vikram Seth
-- white_tiger.jpg - The White Tiger by Aravind Adiga
-- shantaram.jpg - Shantaram by Gregory David Roberts
-- rozabal_line.jpg - The Rozabal Line by Ashwin Sanghi
-- sacred_games.jpg - Sacred Games by Vikram Chandra

-- Japan Books:
-- tale_genji.jpg - The Tale of Genji by Murasaki Shikibu
-- kafka_shore.jpg - Kafka on the Shore by Haruki Murakami
-- windup_bird.jpg - The Wind-Up Bird Chronicle by Haruki Murakami
-- snow_country.jpg - Snow Country by Yasunari Kawabata
-- book_tea.jpg - The Book of Tea by Kakuzo Okakura
-- battle_royale.jpg - Battle Royale by Koushun Takami
-- sailor_grace.jpg - The Sailor Who Fell from Grace with the Sea by Yukio Mishima
-- kitchen.jpg - Kitchen by Banana Yoshimoto

-- China Books:
-- journey_west.jpg - Journey to the West by Wu Cheng'en
-- red_chamber.jpg - Dream of the Red Chamber by Cao Xueqin
-- wild_swans.jpg - Wild Swans by Jung Chang
-- good_earth.jpg - The Good Earth by Pearl S. Buck
-- red_sorghum.jpg - Red Sorghum by Mo Yan
-- balzac_seamstress.jpg - Balzac and the Little Chinese Seamstress by Dai Sijie
-- wolf_totem.jpg - Wolf Totem by Jiang Rong
-- three_body.jpg - The Three-Body Problem by Liu Cixin

-- Nigeria Books:
-- purple_hibiscus.jpg - Purple Hibiscus by Chimamanda Ngozi Adichie
-- yellow_sun.jpg - Half of a Yellow Sun by Chimamanda Ngozi Adichie
-- joys_motherhood.jpg - The Joys of Motherhood by Buchi Emecheta
-- americanah.jpg - Americanah by Chimamanda Ngozi Adichie
-- beautiful_ones.jpg - The Beautiful Ones Are Not Yet Born by Ayi Kwei Armah
-- long_letter.jpg - So Long a Letter by Mariama Bâ
-- palm_wine.jpg - The Palm-Wine Drinkard by Amos Tutuola
-- nervous_conditions.jpg - Nervous Conditions by Tsitsi Dangarembga

-- Brazil Books:
-- dom_casmurro.jpg - Dom Casmurro by Machado de Assis
-- alchemist.jpg - The Alchemist by Paulo Coelho
-- gabriela.jpg - Gabriela, Clove and Cinnamon by Jorge Amado
-- hour_star.jpg - The Hour of the Star by Clarice Lispector
-- dona_flor.jpg - Dona Flor and Her Two Husbands by Jorge Amado
-- city_god.jpg - City of God by Paulo Lins
-- passion_gh.jpg - The Passion According to G.H. by Clarice Lispector
-- captain_sands.jpg - Captain of the Sands by Jorge Amado

-- Mexico Books:
-- water_chocolate.jpg - Like Water for Chocolate by Laura Esquivel
-- pedro_paramo.jpg - Pedro Páramo by Juan Rulfo
-- labyrinth_solitude.jpg - The Labyrinth of Solitude by Octavio Paz
-- under_volcano.jpg - Under the Volcano by Malcolm Lowry
-- artemio_cruz.jpg - The Death of Artemio Cruz by Carlos Fuentes
-- air_clear.jpg - Where the Air Is Clear by Carlos Fuentes
-- underdogs.jpg - The Underdogs by Mariano Azuela
-- aura.jpg - Aura by Carlos Fuentes

-- INSTRUCTIONS FOR UPDATING:
-- 1. Download book cover images from sources like:
--    - Google Images (search "book title author cover")
--    - Amazon book pages
--    - Goodreads
--    - Publisher websites
--    - Open Library (openlibrary.org)
--
-- 2. Save images as JPG files with the exact names listed above
--    in: C:\Users\chand\OneDrive\Desktop\PROJECT\taletrail\frontend\images\covers\
--
-- 3. Recommended image dimensions: 300x400 pixels (3:4 aspect ratio)
--
-- 4. After downloading all images, run this query to verify all paths exist:
SELECT title, author, cover_image_url 
FROM books 
WHERE cover_image_url LIKE 'images/covers/%'
ORDER BY title;

-- 5. The frontend will automatically display the new images when you refresh!

-- Optional: If you want to update any existing image paths, use this template:
-- UPDATE books SET cover_image_url = 'images/covers/new_filename.jpg' WHERE title = 'Book Title';