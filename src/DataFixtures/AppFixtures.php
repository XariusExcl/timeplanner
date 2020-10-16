<?php

namespace App\DataFixtures;

use App\Entity\Event;
use App\Entity\User;
use DateTime;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setEmail("abcd@ab.cd");
        $password = $this->encoder->encodePassword($user, 'abcd');
        $user->setPassword($password);

        $event1 = new Event();
        $event1->setUser($user);
        $event1->setTitle("Test 1");
        $event1->setDescription("Évènement de test 1");
        $event1->setStartDate(DateTime::createFromFormat('d/m/Y H:i', '01/10/2020 08:00'));
        $manager->persist($event1);

        $event2 = new Event();
        $event2->setUser($user);
        $event2->setTitle("Test 2");
        $event2->setDescription("Évènement de test 2");
        $event2->setStartDate(DateTime::createFromFormat('d/m/Y H:i', '01/10/2020 08:00'));
        $event2->setEndDate(DateTime::createFromFormat('d/m/Y H:i', '03/10/2020 16:00'));
        $manager->persist($event2);

        $user->addEvent($event1);
        $user->addEvent($event2);
        $manager->persist($user);

        $user2 = new User();
        $user2->setEmail("jules@ab.cd");
        $password = $this->encoder->encodePassword($user2, 'abcd');
        $user2->setPassword($password);

        $event3 = new Event();
        $event3->setUser($user);
        $event3->setTitle("Test 3");
        $event3->setDescription("Évènement de test 3");
        $event3->setStartDate(DateTime::createFromFormat('d/m/Y H:i', '08/10/2020 08:00'));
        $manager->persist($event3);

        $event4 = new Event();
        $event4->setUser($user);
        $event4->setTitle("Test 4");
        $event4->setDescription("Évènement de test 4");
        $event4->setStartDate(DateTime::createFromFormat('d/m/Y H:i', '08/10/2020 08:00'));
        $event4->setEndDate(DateTime::createFromFormat('d/m/Y H:i', '10/10/2020 16:00'));
        $manager->persist($event4);

        $user2->addEvent($event3);
        $user2->addEvent($event4);
        $manager->persist($user2);

        $manager->flush();
    }
}
