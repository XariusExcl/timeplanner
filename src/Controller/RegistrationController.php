<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use ProxyManager\ProxyGenerator\NullObject\MethodGenerator\StaticProxyConstructor;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class RegistrationController extends AbstractController
{
    /** @var UserRepository $userRepository */
    private $userRepository;

    private $encoder;

    /**
     * AuthController Constructor
     *
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $encoder)
    {
        $this->userRepository = $userRepository;
        $this->encoder = $encoder;
    }

    /**
     * @Route("/registration", name="registration")
     */
    /*
    public function index()
    {
        return $this->render('registration/index.html.twig', [
            'controller_name' => 'RegistrationController',
        ]);
    }
    */

    /**
     * Register new user
     * @param Request $request
     * @param EntityManagerInterface $manager
     *
     * @return Response
     */
    public function register(Request $request, EntityManagerInterface $manager)
    {
        $newUserData = json_decode($request->getContent());

        if (!isset($newUserData->email) || !isset($newUserData->password))
            return new JsonResponse("Data utilisateur invalides (email ou mdp null)" . var_dump($newUserData), 500);

        $user = new User();
        $user->setEmail($newUserData->email);
        $password = $this->encoder->encodePassword($user, $newUserData->password);
        $user->setPassword($password);
        $manager->persist($user);
        $manager->flush();

        return new JsonResponse("OK", 200);
    }
}
