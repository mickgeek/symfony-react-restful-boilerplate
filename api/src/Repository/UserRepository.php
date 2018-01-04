<?php

namespace App\Repository;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class UserRepository
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
     * @param User $user
     */
    public function add(User $user)
    {
        $this->entityManager->persist($user);
        $this->entityManager->flush($user);
    }

    /**
     * @param User $user
     */
    public function save(User $user)
    {
        $this->entityManager->flush($user);
    }

    /**
     * @param User $user
     */
    public function remove(User $user)
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush($user);
    }

    /**
     * @return array
     */
    public function find(): array
    {
        return $this->entityManager->getRepository(User::class)->findBy([], ['id' => 'ASC']);
    }

    /**
     * @param int $pk
     *
     * @return User|null
     */
    public function findByPK(int $pk): ?User
    {
        return $this->entityManager->getRepository(User::class)->find($pk);
    }

    /**
     * @param string $email
     *
     * @return User|null
     */
    public function findOneByEmail(string $email): ?User
    {
        return $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
    }
}
