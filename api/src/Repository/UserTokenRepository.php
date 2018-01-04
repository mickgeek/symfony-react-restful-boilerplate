<?php

namespace App\Repository;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserToken;

class UserTokenRepository
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param UserToken $token
     */
    public function add(UserToken $token)
    {
        $this->entityManager->persist($token);
        $this->entityManager->flush($token);
    }

    /**
     * @param UserToken $token
     */
    public function save(UserToken $token)
    {
        $this->entityManager->flush($token);
    }

    /**
     * @param UserToken $token
     */
    public function remove(UserToken $token)
    {
        $this->entityManager->remove($token);
        $this->entityManager->flush($token);
    }

    /**
     * @param string $pk
     *
     * @return UserToken|null
     */
    public function findByPK(string $pk): ?UserToken
    {
        return $this->entityManager->getRepository(UserToken::class)->find($pk);
    }
}
