<?php

namespace App\Listener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Event\{JWTCreatedEvent, JWTFailureEventInterface};

class JWTSubscriber implements EventSubscriberInterface
{
    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents(): array
    {
        return [
            Events::JWT_CREATED => 'onJWTCreated',
            Events::JWT_NOT_FOUND => 'onJWTFailure',
            Events::JWT_INVALID => 'onJWTFailure',
            Events::JWT_EXPIRED => 'onJWTFailure',
        ];
    }

    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $payload = [
            'email' => $user->getEmail(), // identity field
            'role' => $user->getRole(),
            'status' => $user->getStatus(),
            'sub' => $user->getID(),
        ];

        $event->setData($payload);
    }

    /**
     * @param JWTFailureEventInterface $event
     *
     * @return void
     */
    public function onJWTFailure(JWTFailureEventInterface $event)
    {
        $response = ['message' => 'JWT is not found, invalid or expired.'];

        $event->setResponse(new JsonResponse($response, JsonResponse::HTTP_UNAUTHORIZED, ['WWW-Authenticate' => 'Bearer']));
    }
}
