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
        $event2->setEndDate(DateTime::createFromFormat('d/m/Y H:i', '01/11/2020 16:00'));
        $manager->persist($event2);

        $user->addEvent($event1);
        $user->addEvent($event2);
        $manager->persist($user);

        $manager->flush();
    }
}
