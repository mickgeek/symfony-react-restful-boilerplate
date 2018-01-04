<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use App\Entity\User;
use App\Repository\UserRepository;
use App\DTO\PasswordChangeDTO;
use App\Form\Type\PasswordChangeType;
use App\Form\Util\FormHelper;

class AccountController
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var FormFactoryInterface
     */
    private $formFactory;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param TokenStorageInterface $tokenStorage
     * @param UserPasswordEncoderInterface $encoder
     * @param FormFactoryInterface $formFactory
     * @param UserRepository $userRepository
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        UserPasswordEncoderInterface $encoder,
        FormFactoryInterface $formFactory,
        UserRepository $userRepository
    )
    {
        $this->tokenStorage = $tokenStorage;
        $this->encoder = $encoder;
        $this->formFactory = $formFactory;
        $this->userRepository = $userRepository;
    }

    /**
     * @Config\Route("/account", name="account_index")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return new JsonResponse([
            'attributes' => [
                'id' => $user->getID(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'status' => $user->getStatus(),
                'createdAt' => $user->getCreatedAt(DATE_ATOM),
                'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
            ],
        ]);
    }

    /**
     * @Config\Route("/account", name="account_update")
     * @Config\Method("PATCH")
     * @Config\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $body = (array) json_decode($request->getContent(), true);
        if (isset($body['passwordChange'])) {
            $dto = new PasswordChangeDTO();
            $form = $this->formFactory->create(PasswordChangeType::class, $dto);
            $form->submit($body['passwordChange']);
            if (!$form->isValid()) {
                $response = [
                    'message' => 'Data validation failed.',
                    'errors' => (new FormHelper())->convertErrors($form),
                ];

                return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user = $this->tokenStorage->getToken()->getUser();
            $user->setPasswordHash($this->encoder->encodePassword($user, $dto->getNewPassword()));
            $this->userRepository->save($user);

            return new JsonResponse([
                'attributes' => [
                    'id' => $user->getID(),
                    'email' => $user->getEmail(),
                    'role' => $user->getRole(),
                    'status' => $user->getStatus(),
                    'createdAt' => $user->getCreatedAt(DATE_ATOM),
                    'updatedAt' => $user->getUpdatedAt(DATE_ATOM),
                    'lastLoginAt' => $user->getLastLoginAt(DATE_ATOM),
                ],
            ]);
        }

        return new JsonResponse(['message' => 'Missing or invalid body parameters.'], JsonResponse::HTTP_BAD_REQUEST);
    }
}
