<?php

namespace App\Entity;

use DateTime;
use DateTimeImmutable;
use DateInterval;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity()
 * @ORM\Table(name="user_token")
 */
class UserToken
{
    const TYPE_ACCOUNT_ACTIVATION = 1;
    const TYPE_PASSWORD_RESET = 2;
    const TYPE_EMAIL_CHANGE = 3;

    const TTL_PASSWORD_RESET_REQUEST = 86400;
    const TTL_EMAIL_CHANGE = 86400;

    /**
     * @ORM\Column(type="uuid", name="uuid", unique=true)
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     *
     * @var Uuid
     */
    private $uuid;

    /**
     * @ORM\Column(type="integer", name="user_id")
     *
     * @var int
     */
    private $userID;

    /**
     * @ORM\Column(type="integer", name="type")
     *
     * @var int
     */
    private $type;

    /**
     * @ORM\Column(type="string", name="comment", length=255)
     *
     * @var string
     */
    private $comment = '';

    /**
     * @ORM\Column(type="datetime", name="created_at")
     *
     * @var DateTime
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", name="used_at", nullable=true)
     *
     * @var DateTime|null
     */
    private $usedAt;

    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="tokens")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *
     * @var User
     */
    private $user;

    /**
     * @param User $user
     * @param int $type
     * @param string $comment
     */
    public function __construct(User $user, int $type, string $comment = null)
    {
        $this->user = $user;
        $this->type = $type;
        $comment === null ?: $this->comment = $comment;
        $this->createdAt = new DateTimeImmutable();
    }

    /**
     * @return string
     */
    public function getUUID(): string
    {
        return (string) $this->uuid;
    }

    /**
     * @param DateTimeImmutable $usedAt
     */
    public function setUsedAt(DateTimeImmutable $usedAt)
    {
        $this->usedAt = $usedAt;
    }

    /**
     * @return int
     */
    public function getUserID(): int
    {
        return $this->userID;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getComment(): string
    {
        return $this->comment;
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
     * @param string $format
     *
     * @return DateTime|string|null
     */
    public function getUsedAt(string $format = null)
    {
        if ($this->usedAt !== null && $format !== null) {
            return (clone $this->usedAt)->format($format);
        }

        return $this->usedAt;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return bool
     */
    public function isExpired(): bool
    {
        if ($this->type === self::TYPE_PASSWORD_RESET) {
            $expiredAt = (clone $this->createdAt)->add(new DateInterval('PT' . self::TTL_PASSWORD_RESET_REQUEST . 'S'));
            if ($expiredAt < new DateTimeImmutable()) {
                return true;
            }
        }
        if ($this->type === self::TYPE_EMAIL_CHANGE) {
            $expiredAt = (clone $this->createdAt)->add(new DateInterval('PT' . self::TTL_EMAIL_CHANGE . 'S'));
            if ($expiredAt < new DateTimeImmutable()) {
                return true;
            }
        }

        return false;
    }
}
