<?php

namespace App\Controller;

use DateTimeImmutable;
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;
use Ramsey\Uuid\Uuid;
use App\Entity\{User, UserToken};
use App\Repository\{UserRepository, UserTokenRepository};
use App\DTO\{PasswordResetRequestDTO, EmailChangeDTO, PasswordResetDTO};
use App\Form\Type\{AccountActivationType, PasswordResetRequestType, EmailChangeType, PasswordResetType};
use App\Form\Util\FormHelper;
use App\Mailer\UserMailer;

class UserTokenController
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorizationChecker;

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
     * @var UserTokenRepository
     */
    private $tokenRepository;

    /**
     * @var UserMailer
     */
    private $mailer;

    /**
     * @param AuthorizationCheckerInterface $authorizationChecker
     * @param TokenStorageInterface $tokenStorage
     * @param UserPasswordEncoderInterface $encoder
     * @param FormFactoryInterface $formFactory
     * @param UserRepository $userRepository
     * @param UserTokenRepository $tokenRepository
     * @param UserMailer $mailer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorizationChecker,
        TokenStorageInterface $tokenStorage,
        UserPasswordEncoderInterface $encoder,
        FormFactoryInterface $formFactory,
        UserRepository $userRepository,
        UserTokenRepository $tokenRepository,
        UserMailer $mailer
    )
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->tokenStorage = $tokenStorage;
        $this->encoder = $encoder;
        $this->formFactory = $formFactory;
        $this->userRepository = $userRepository;
        $this->tokenRepository = $tokenRepository;
        $this->mailer = $mailer;
    }

    /**
     * @Config\Route("/user-tokens", name="user_token_create")
     * @Config\Method("POST")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $body = (array) json_decode($request->getContent(), true);
        if ($this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY')) {
            if (isset($body['emailChange'])) {
                $dto = new EmailChangeDTO();
                $form = $this->formFactory->create(EmailChangeType::class, $dto);
                $form->submit($body['emailChange']);
                if (!$form->isValid()) {
                    $response = [
                        'message' => 'Data validation failed.',
                        'errors' => (new FormHelper())->convertErrors($form),
                    ];

                    return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
                }

                $user = $this->tokenStorage->getToken()->getUser();
                $token = new UserToken($user, UserToken::TYPE_EMAIL_CHANGE, $dto->getNewEmail());
                $this->tokenRepository->add($token);
                $this->mailer->sendEmailChangeMessage($token, $dto->getAppURL());

                return new JsonResponse();
            }
        } else {
            if (isset($body['passwordReset'])) {
                $dto = new PasswordResetRequestDTO();
                $form = $this->formFactory->create(PasswordResetRequestType::class, $dto);
                $form->submit($body['passwordReset']);
                if (!$form->isValid()) {
                    $response = [
                        'message' => 'Data validation failed.',
                        'errors' => (new FormHelper())->convertErrors($form),
                    ];

                    return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
                }

                $user = $this->userRepository->findOneByEmail($dto->getEmail());
                $token = new UserToken($user, UserToken::TYPE_PASSWORD_RESET);
                $this->tokenRepository->add($token);
                $this->mailer->sendPasswordResetMessage($user, $token, $dto->getAppURL());

                return new JsonResponse();
            }
        }

        return new JsonResponse(['message' => 'Missing or invalid body parameters.'], JsonResponse::HTTP_BAD_REQUEST);
    }

    /**
     * @Config\Route("/user-tokens/{token}", name="user_token_read")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param string $token
     *
     * @return JsonResponse
     */
    public function read(string $token): JsonResponse
    {
        if (!Uuid::isValid($token) || ($token = $this->tokenRepository->findByPK($token)) === null) {
            return new JsonResponse(['message' => 'Token not found.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'attributes' => [
                'uuid' => $token->getUUID(),
                'user_id' => $token->getUserID(),
                'type' => $token->getType(),
                'comment' => $token->getComment(),
                'createdAt' => $token->getCreatedAt(DATE_ATOM),
                'usedAt' => $token->getUsedAt(DATE_ATOM),
                'isExpired' => $token->isExpired(),
            ],
        ]);
    }

    /**
     * @Config\Route("/user-tokens/{token}/account-activation", name="user_token_update_account_activation")
     * @Config\Method("PATCH")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param string $token
     *
     * @return JsonResponse
     */
    public function updateAccountActivation(string $token): JsonResponse
    {
        if (!Uuid::isValid($token) || ($token = $this->tokenRepository->findByPK($token)) === null) {
            return new JsonResponse(['message' => 'Token not found.'], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($token->getUsedAt() !== null) {
            return new JsonResponse(['message' => 'Token is already used.'], JsonResponse::HTTP_GONE);
        }

        $user = $token->getUser();
        $user->setStatus(User::STATUS_ACTIVE);
        $this->userRepository->save($user);
        $token->setUsedAt(new DateTimeImmutable());
        $this->tokenRepository->save($token);

        return new JsonResponse();
    }

    /**
     * @Config\Route("/user-tokens/{token}/password-reset", name="user_token_update_password_reset")
     * @Config\Method("PATCH")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @param Request $request
     * @param string $token
     *
     * @return JsonResponse
     */
    public function updatePasswordReset(Request $request, string $token): JsonResponse
    {
        if (!Uuid::isValid($token) || ($token = $this->tokenRepository->findByPK($token)) === null) {
            return new JsonResponse(['message' => 'Token not found.'], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($token->getUsedAt() !== null) {
            return new JsonResponse(['message' => 'Token is already used.', 'code' => 'token_used'], JsonResponse::HTTP_GONE);
        }
        if ($token->isExpired()) {
            return new JsonResponse(['message' => 'Token is expired.', 'code' => 'token_expired'], JsonResponse::HTTP_GONE);
        }

        $body = (array) json_decode($request->getContent(), true);
        $dto = new PasswordResetDTO();
        $form = $this->formFactory->create(PasswordResetType::class, $dto);
        $form->submit($body);
        if (!$form->isValid()) {
            $response = [
                'message' => 'Data validation failed.',
                'errors' => (new FormHelper())->convertErrors($form),
            ];

            return new JsonResponse($response, JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = $token->getUser();
        $user->setPasswordHash($this->encoder->encodePassword($user, $dto->getNewPassword()));
        $this->userRepository->save($user);
        $token->setUsedAt(new DateTimeImmutable());
        $this->tokenRepository->save($token);

        return new JsonResponse();
    }

    /**
     * @Config\Route("/user-tokens/{token}/email-change", name="user_token_update_email_change")
     * @Config\Method("PATCH")
     * @Config\Security("is_granted('IS_AUTHENTICATED_FULLY')")
     *
     * @param string $token
     *
     * @return JsonResponse
     */
    public function updateEmailChange(string $token): JsonResponse
    {
        if (!Uuid::isValid($token) || ($token = $this->tokenRepository->findByPK($token)) === null) {
            return new JsonResponse(['message' => 'Token not found.'], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($token->getUsedAt() !== null) {
            return new JsonResponse(['message' => 'Token is already used.', 'code' => 'token_used'], JsonResponse::HTTP_GONE);
        }
        if ($token->isExpired()) {
            return new JsonResponse(['message' => 'Token is expired.', 'code' => 'token_expired'], JsonResponse::HTTP_GONE);
        }

        $user = $token->getUser();
        $user->setEmail($token->getComment());
        $this->userRepository->save($user);
        $token->setUsedAt(new DateTimeImmutable());
        $this->tokenRepository->save($token);

        return new JsonResponse();
    }
}
