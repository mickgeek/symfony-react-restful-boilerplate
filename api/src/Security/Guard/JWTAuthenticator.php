<?php

namespace App\Security\Guard;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Guard\JWTTokenAuthenticator as BaseAuthenticator;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use App\Entity\User;

class JWTAuthenticator extends BaseAuthenticator
{
    /**
     * {@inheritdoc}
     *
     * @throws AuthenticationException
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        $payload = $credentials->getPayload();
        if ($payload['role'] !== $user->getRole()) {
            throw new AuthenticationException();
        }

        $statuses = [User::STATUS_INACTIVE, User::STATUS_CLOSED, User::STATUS_BLOCKED];
        if (in_array($user->getStatus(), $statuses)) {
            throw new AuthenticationException();
        }

        return true;
    }
}
