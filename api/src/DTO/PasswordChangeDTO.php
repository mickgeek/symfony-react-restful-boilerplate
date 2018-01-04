<?php

namespace App\DTO;

class PasswordChangeDTO
{
    /**
     * @var string|null
     */
    private $currentPassword;

    /**
     * @var string|null
     */
    private $newPassword;

    /**
     * @param string $currentPassword
     */
    public function setCurrentPassword(string $currentPassword)
    {
        $this->currentPassword = $currentPassword;
    }

    /**
     * @return string|null
     */
    public function getCurrentPassword(): ?string
    {
        return $this->currentPassword;
    }

    /**
     * @param string $newPassword
     */
    public function setNewPassword(string $newPassword)
    {
        $this->newPassword = $newPassword;
    }

    /**
     * @return string|null
     */
    public function getNewPassword(): ?string
    {
        return $this->newPassword;
    }
}
