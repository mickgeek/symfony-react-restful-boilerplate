<?php

namespace App\Security\HTTP;

use DateTimeImmutable;
use Symfony\Component\Security\Http\Authentication\{
    SimplePreAuthenticatorInterface,
    AuthenticationSuccessHandlerInterface,
    AuthenticationFailureHandlerInterface,
};
use Symfony\Component\Security\Core\Authentication\Token\{PreAuthenticatedToken, TokenInterface};
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\{
    BadCredentialsException,
    UsernameNotFoundException,
    AuthenticationException,
};
use Symfony\Component\HttpFoundation\{Request, JsonResponse};
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
use App\Repository\UserRepository;

class JSONAuthenticator implements SimplePreAuthenticatorInterface, AuthenticationSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var JWTTokenManagerInterface
     */
    private $tokenManager;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserPasswordEncoderInterface $encoder
     * @param JWTTokenManagerInterface $tokenManager
     * @param UserRepository $userRepository
     */
    public function __construct(
        UserPasswordEncoderInterface $encoder,
        JWTTokenManagerInterface $tokenManager,
        UserRepository $userRepository
    )
    {
        $this->encoder = $encoder;
        $this->tokenManager = $tokenManager;
        $this->userRepository = $userRepository;
    }

    /**
     * {@inheritdoc}
     *
     * @throws BadCredentialsException
     */
    public function createToken(Request $request, $providerKey): PreAuthenticatedToken
    {
        $credentials = (array) json_decode($request->getContent(), true);
        if (!isset($credentials['email'], $credentials['password'])) {
            throw new BadCredentialsException();
        }

        return new PreAuthenticatedToken($credentials['email'], $credentials, $providerKey);
    }

    /**
     * {@inheritdoc}
     */
    public function supportsToken(TokenInterface $token, $providerKey): bool
    {
        return $token instanceof PreAuthenticatedToken && $token->getProviderKey() === $providerKey;
    }

    /**
     * {@inheritdoc}
     *
     * @throws AuthenticationException
     */
    public function authenticateToken(TokenInterface $token, UserProviderInterface $userProvider, $providerKey): PreAuthenticatedToken
    {
        $credentials = $token->getCredentials();
        try {
            $user = $userProvider->loadUserByUsername($credentials['email']);
        } catch (UsernameNotFoundException $exception) {
            throw new AuthenticationException('Invalid email or password.');
        }

        if (!$this->encoder->isPasswordValid($user, $credentials['password'])) {
            throw new AuthenticationException('Invalid email or password.');
        }

        switch ($user->getStatus()) {
            case User::STATUS_INACTIVE:
                throw new AuthenticationException('Account is inactive.');
            case User::STATUS_CLOSED:
                throw new AuthenticationException('Account is closed.');
            case User::STATUS_BLOCKED:
                throw new AuthenticationException('Account is blocked.');
        }

        return new PreAuthenticatedToken($user, $credentials, $providerKey, $user->getRoles());
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $user = $token->getUser();
        $user->setLastLoginAt(new DateTimeImmutable());
        $this->userRepository->save($user);

        $response = ['attributes' => ['accessToken' => $this->tokenManager->create($user)]];

        return new JsonResponse($response, JsonResponse::HTTP_CREATED);
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        $response = ['message' => $exception->getMessage()];

        return new JsonResponse($response, JsonResponse::HTTP_UNAUTHORIZED, ['WWW-Authenticate' => 'Bearer']);
    }
}
