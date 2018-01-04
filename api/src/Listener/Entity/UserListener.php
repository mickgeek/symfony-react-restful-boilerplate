<?php

namespace App\Listener\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Event\LifecycleEventArgs;
use App\Entity\User;

class UserListener
{
    /**
     * @param User $user
     * @param LifecycleEventArgs $args
     */
    public function preUpdate(User $user, LifecycleEventArgs $args)
    {
        $user->setUpdatedAt(new DateTimeImmutable());
    }
}
