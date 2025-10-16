-- Update all book cover image URLs to use local images
-- This will fix the missing images issue in the recommendations section

USE taletrail_db;

-- Update all book covers to use local images that exist
UPDATE books SET cover_image_url = 'images/covers/pride_prejudice.jpg' WHERE title = 'Pride and Prejudice';
UPDATE books SET cover_image_url = 'images/covers/lord_rings.jpg' WHERE title = 'The Lord of the Rings';
UPDATE books SET cover_image_url = 'images/covers/sherlock_holmes.jpg' WHERE title = 'The Adventures of Sherlock Holmes';
UPDATE books SET cover_image_url = 'images/covers/jane_eyre.jpg' WHERE title = 'Jane Eyre';
UPDATE books SET cover_image_url = 'images/covers/animal_farm.jpg' WHERE title = 'Animal Farm';
UPDATE books SET cover_image_url = 'images/covers/wuthering_heights.jpg' WHERE title = 'Wuthering Heights';
UPDATE books SET cover_image_url = 'images/covers/chronicles_narnia.jpg' WHERE title = 'The Chronicles of Narnia';

UPDATE books SET cover_image_url = 'images/covers/catcher_rye.jpg' WHERE title = 'The Catcher in the Rye';
UPDATE books SET cover_image_url = 'images/covers/gone_wind.jpg' WHERE title = 'Gone with the Wind';
UPDATE books SET cover_image_url = 'images/covers/huck_finn.jpg' WHERE title = 'Adventures of Huckleberry Finn';
UPDATE books SET cover_image_url = 'images/covers/mice_men.jpg' WHERE title = 'Of Mice and Men';
UPDATE books SET cover_image_url = 'images/covers/grapes_wrath.jpg' WHERE title = 'The Grapes of Wrath';
UPDATE books SET cover_image_url = 'images/covers/moby_dick.jpg' WHERE title = 'Moby Dick';

UPDATE books SET cover_image_url = 'images/covers/crime_punishment.jpg' WHERE title = 'Crime and Punishment';
UPDATE books SET cover_image_url = 'images/covers/war-peace.jpg' WHERE title = 'War and Peace';
UPDATE books SET cover_image_url = 'images/covers/anna_karenina.jpg' WHERE title = 'Anna Karenina';
UPDATE books SET cover_image_url = 'images/covers/brothers_karamazov.jpg' WHERE title = 'The Brothers Karamazov';
UPDATE books SET cover_image_url = 'images/covers/dead_souls.jpg' WHERE title = 'Dead Souls';
UPDATE books SET cover_image_url = 'images/covers/doctor_zhivago.jpg' WHERE title = 'Doctor Zhivago';
UPDATE books SET cover_image_url = 'images/covers/master_margarita.jpg' WHERE title = 'The Master and Margarita';

UPDATE books SET cover_image_url = 'images/covers/1984.jpg' WHERE title = '1984';
UPDATE books SET cover_image_url = 'images/covers/great-gatsby.jpg' WHERE title = 'The Great Gatsby';
UPDATE books SET cover_image_url = 'images/covers/mockingbird.jpg' WHERE title = 'To Kill a Mockingbird';
UPDATE books SET cover_image_url = 'images/covers/scarlet_letter.jpg' WHERE title = 'The Scarlet Letter';

UPDATE books SET cover_image_url = 'images/covers/little-prince.jpg' WHERE title = 'The Little Prince';
UPDATE books SET cover_image_url = 'images/covers/les_miserables.jpg' WHERE title = 'Les Misérables';
UPDATE books SET cover_image_url = 'images/covers/monte_cristo.jpg' WHERE title = 'The Count of Monte Cristo';
UPDATE books SET cover_image_url = 'images/covers/madame_bovary.jpg' WHERE title = 'Madame Bovary';
UPDATE books SET cover_image_url = 'images/covers/candide.jpg' WHERE title = 'Candide';
UPDATE books SET cover_image_url = 'images/covers/the_stranger.jpg' WHERE title = 'The Stranger';
UPDATE books SET cover_image_url = 'images/covers/nausea.jpg' WHERE title = 'Nausea';

UPDATE books SET cover_image_url = 'images/covers/tale_genji.jpg' WHERE title = 'The Tale of Genji';
UPDATE books SET cover_image_url = 'images/covers/kafka_shore.jpg' WHERE title = 'Kafka on the Shore';
UPDATE books SET cover_image_url = 'images/covers/snow_country.jpg' WHERE title = 'Snow Country';
UPDATE books SET cover_image_url = 'images/covers/kitchen.jpg' WHERE title = 'Kitchen';
UPDATE books SET cover_image_url = 'images/covers/battle_royale.jpg' WHERE title = 'Battle Royale';
UPDATE books SET cover_image_url = 'images/covers/windup_bird.jpg' WHERE title = 'The Wind-Up Bird Chronicle';

UPDATE books SET cover_image_url = 'images/covers/mahabharata.jpg' WHERE title = 'Mahabharata';
UPDATE books SET cover_image_url = 'images/covers/god_small_things.jpg' WHERE title = 'The God of Small Things';
UPDATE books SET cover_image_url = 'images/covers/midnight-children.jpg' WHERE title = 'Midnight\'s Children';
UPDATE books SET cover_image_url = 'images/covers/suitable_boy.jpg' WHERE title = 'A Suitable Boy';
UPDATE books SET cover_image_url = 'images/covers/white_tiger.jpg' WHERE title = 'The White Tiger';
UPDATE books SET cover_image_url = 'images/covers/sacred_games.jpg' WHERE title = 'Sacred Games';
UPDATE books SET cover_image_url = 'images/covers/shantaram.jpg' WHERE title = 'Shantaram';

UPDATE books SET cover_image_url = 'images/covers/dom_casmurro.jpg' WHERE title = 'Dom Casmurro';
UPDATE books SET cover_image_url = 'images/covers/gabriela.jpg' WHERE title = 'Gabriela, Clove and Cinnamon';
UPDATE books SET cover_image_url = 'images/covers/dona_flor.jpg' WHERE title = 'Dona Flor and Her Two Husbands';
UPDATE books SET cover_image_url = 'images/covers/hour_star.jpg' WHERE title = 'The Hour of the Star';
UPDATE books SET cover_image_url = 'images/covers/captain_sands.jpg' WHERE title = 'The Devil to Pay in the Backlands';
UPDATE books SET cover_image_url = 'images/covers/passion_gh.jpg' WHERE title = 'The Passion According to G.H.';
UPDATE books SET cover_image_url = 'images/covers/city_god.jpg' WHERE title = 'City of God';

UPDATE books SET cover_image_url = 'images/covers/things-fall-apart.jpg' WHERE title = 'Things Fall Apart';
UPDATE books SET cover_image_url = 'images/covers/half-yellow-sun.jpg' WHERE title = 'Half of a Yellow Sun';
UPDATE books SET cover_image_url = 'images/covers/americanah.jpg' WHERE title = 'Americanah';
UPDATE books SET cover_image_url = 'images/covers/purple_hibiscus.jpg' WHERE title = 'Purple Hibiscus';
UPDATE books SET cover_image_url = 'images/covers/beautiful_ones.jpg' WHERE title = 'The Beautyful Ones Are Not Yet Born';
UPDATE books SET cover_image_url = 'images/covers/palm_wine.jpg' WHERE title = 'The Palm-Wine Drinkard';
UPDATE books SET cover_image_url = 'images/covers/nervous_conditions.jpg' WHERE title = 'Nervous Conditions';

UPDATE books SET cover_image_url = 'images/covers/journey_west.jpg' WHERE title = 'Journey to the West';
UPDATE books SET cover_image_url = 'images/covers/dream-red-chamber.jpg' WHERE title = 'Dream of the Red Chamber';
UPDATE books SET cover_image_url = 'images/covers/three_body.jpg' WHERE title = 'The Three-Body Problem';
UPDATE books SET cover_image_url = 'images/covers/red_sorghum.jpg' WHERE title = 'Red Sorghum';
UPDATE books SET cover_image_url = 'images/covers/wild_swans.jpg' WHERE title = 'Wild Swans';
UPDATE books SET cover_image_url = 'images/covers/wolf_totem.jpg' WHERE title = 'Wolf Totem';
UPDATE books SET cover_image_url = 'images/covers/balzac_seamstress.jpg' WHERE title = 'Balzac and the Little Chinese Seamstress';

UPDATE books SET cover_image_url = 'images/covers/labyrinth_solitude.jpg' WHERE title = 'The Labyrinth of Solitude';
UPDATE books SET cover_image_url = 'images/covers/pedro_paramo.jpg' WHERE title = 'Pedro Páramo';
UPDATE books SET cover_image_url = 'images/covers/like-water-chocolate.jpg' WHERE title = 'Like Water for Chocolate';
UPDATE books SET cover_image_url = 'images/covers/under_volcano.jpg' WHERE title = 'Under the Volcano';
UPDATE books SET cover_image_url = 'images/covers/artemio_cruz.jpg' WHERE title = 'The Death of Artemio Cruz';
UPDATE books SET cover_image_url = 'images/covers/aura.jpg' WHERE title = 'Aura';
UPDATE books SET cover_image_url = 'images/covers/underdogs.jpg' WHERE title = 'The Underdogs';

-- Verify some key books have been updated
SELECT title, cover_image_url FROM books WHERE title IN ('Pride and Prejudice', 'Wuthering Heights', 'Jane Eyre', 'The Chronicles of Narnia') LIMIT 5;