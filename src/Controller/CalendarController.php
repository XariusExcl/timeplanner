<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Json;

class CalendarController extends AbstractController
{
    /**
     * @Route("/api/userevents", methods={"GET"})
     */
    public function getEvents()
    {
        $user = $this->getUser();
        $data['user'] = ['email' => $user->getUsername()];

        $events = [];
        foreach($this->getUser()->getEvent() as $event)
        {
            array_push($events, [
                'id' =>$event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'startDate' => $event->getStartDate(),
                'endDate' => 'Y-m-d h:i:s', $event->getEndDate()
            ]);
        }
        $data['user']['events'] = $events;

        return new JsonResponse(json_encode($data));
    }

    /**
     * @Route("/api/userevents", methods={"POST"})
     */
    public function addEvent(Request $request)
    {
        $manager = $this->getDoctrine()->getManager();

        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $event = new Event();
        $event->setUser($user);
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);

        $startDate = \DateTime::createFromFormat('Y-m-d H:i:s.u', $data['startDate']);
        $endDate = \DateTime::createFromFormat('Y-m-d H:i:s.u', $data['endDate']);

        $event->setStartDate($startDate? $startDate: null);
        $event->setEndDate($endDate? $endDate: null);

        $manager->persist($event);
        $manager->flush();
        return new JsonResponse("Event added!", 200);
    }

    /**
     * @Route("/api/userevents/{event}", methods={"PUT"})
     * @param Event $event
    */
    public function editEvent(Event $event, Request $request)
    {
        $manager = $this->getDoctrine()->getManager();

        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        foreach($user->getEvent() as $e)
        {
            if ($e->getId() == $event->getId())
            {
                $event->setTitle($data['title']);
                $event->setDescription($data['description']);
                $startDate = \DateTime::createFromFormat('Y-m-d H:i:s.u', $data['startDate']);
                $endDate = \DateTime::createFromFormat('Y-m-d H:i:s.u', $data['endDate']);

                $event->setStartDate($startDate? $startDate: null);
                $event->setEndDate($endDate? $endDate: null);

                $manager->flush();
                return new JsonResponse("Event edited!", 200);
            }
        }
        return new JsonResponse(['error' => "Event id:".$event->getId()." doesn't belong to the User!"], 400);
    }


    /**
     * @Route("/api/userevents/{event}", methods={"DELETE"})
     * @param Event $event
     */
    public function deleteEvent(Event $event, Request $request)
    {
        $manager = $this->getDoctrine()->getManager();

        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        foreach($user->getEvent() as $e)
        {
            if ($e->getId() == $event->getId())
            {
                $manager->remove($event);
                $manager->flush();
                return new JsonResponse("Event deleted!", 200);
            }
        }
        return new JsonResponse(['error' => "Event id:".$event->getId()." doesn't belong to the User!"], 400);
    }
}
