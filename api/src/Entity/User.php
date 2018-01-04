<?php

namespace App\Entity;

use Serializable;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="`user`")
 * @ORM\EntityListeners({"App\Listener\Entity\UserListener"})
 */
class User implements UserInterface, Serializable
{
    const ROLE_USER = 1;
    const ROLE_SUPER_ADMIN = 100;

    const STATUS_INACTIVE = 1;
    const STATUS_CLOSED = 2;
    const STATUS_BLOCKED = 3;
    const STATUS_ACTIVE = 10;

    /**
     * @ORM\Column(type="integer", name="id")
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", name="email", length=100, unique=true)
     *
     * @var string
     */
    private $email;

    /**
     * @ORM\Column(type="string", name="password_hash", length=255)
     *
     * @var string
     */
    private $passwordHash;

    /**
     * @ORM\Column(type="integer", name="role")
     *
     * @var int
     */
    private $role = self::ROLE_USER;

    /**
     * @ORM\Column(type="integer", name="status")
     *
     * @var int
     */
    private $status = self::STATUS_INACTIVE;

    /**
     * @ORM\Column(type="datetime", name="created_at")
     *
     * @var DateTime
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", name="updated_at", nullable=true)
     *
     * @var DateTime|null
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="datetime", name="last_login_at", nullable=true)
     *
     * @var DateTime|null
     */
    private $lastLoginAt;

    /**
     * @ORM\OneToMany(targetEntity="UserToken", mappedBy="user", cascade={"persist", "remove"})
     *
     * @var ArrayCollection
     */
    private $tokens;

    /**
     * @param string $email
     * @param int $role
     * @param int $status
     */
    public function __construct(string $email, int $role = null, int $status = null)
    {
        $this->email = $email;
        $role === null ?: $this->role = $role;
        $status === null ?: $this->status = $status;
        $this->createdAt = new DateTimeImmutable();
        $this->tokens = new ArrayCollection();
    }

    /**
     * {@inheritdoc}
     */
    public function getUsername(): string
    {
        return $this->email;
    }

    /**
     * {@inheritdoc}
     */
    public function getPassword(): string
    {
        return $this->passwordHash;
    }

    /**
     * {@inheritdoc}
     */
    public function getSalt(): string
    {
        return '';
    }

    /**
     * {@inheritdoc}
     */
    public function getRoles(): array
    {
        $roles = [];
        switch ($this->role) {
            case self::ROLE_USER:
                $roles[] = 'ROLE_USER';
                break;
            case self::ROLE_SUPER_ADMIN:
                $roles[] = 'ROLE_USER';
                $roles[] = 'ROLE_SUPER_ADMIN';
                break;
        }

        return $roles;
    }

    /**
     * {@inheritdoc}
     */
    public function eraseCredentials()
    {
    }

    /**
     * {@inheritdoc}
     */
    public function serialize(): string
    {
        return serialize([
            $this->id,
            $this->email,
            $this->passwordHash,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function unserialize(/*string */$data)
    {
        list(
            $this->id,
            $this->email,
            $this->passwordHash,
        ) = unserialize($data);
    }

    /**
     * @return int
     */
    public function getID(): int
    {
        return $this->id;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $passwordHash
     */
    public function setPasswordHash(string $passwordHash)
    {
        $this->passwordHash = $passwordHash;
    }

    /**
     * @return string
     */
    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    /**
     * @param int $role
     */
    public function setRole(int $role)
    {
        $this->role = $role;
    }

    /**
     * @return int
     */
    public function getRole(): int
    {
        return $this->role;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status)
    {
        $this->status = $status;
    }

    /**
     * @return int
     */
    public function getStatus(): int
    {
        return $this->status;
    }

    /**
     * @param string $format
     *
     * @return DateTime|string
     */
    public function getCreatedAt(string $format = null)
    {
        if ($this->createdAt !== null && $format !== null) {
            return (clone $this->createdAt)->format($format);
        }

        return $this->createdAt;
    }

    /**
     * @param DateTimeImmutable $updatedAt
     */
    public function setUpdatedAt(DateTimeImmutable $updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @param string $format
     *
     * @return DateTime|string|null
     */
    public function getUpdatedAt(string $format = null)
    {
        if ($this->updatedAt !== null && $format !== null) {
            return (clone $this->updatedAt)->format($format);
        }

        return $this->updatedAt;
    }

    /**
     * @param DateTimeImmutable $lastLoginAt
     */
    public function setLastLoginAt(DateTimeImmutable $lastLoginAt)
    {
        $this->lastLoginAt = $lastLoginAt;
    }

    /**
     * @param string $format
     *
     * @return DateTime|string|null
     */
    public function getLastLoginAt(string $format = null)
    {
        if ($this->lastLoginAt !== null && $format !== null) {
            return (clone $this->lastLoginAt)->format($format);
        }

        return $this->lastLoginAt;
    }

    /**
     * @return ArrayCollection
     */
    public function getTokens(): ArrayCollection
    {
        return $this->tokens;
    }
}
