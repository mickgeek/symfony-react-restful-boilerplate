<?php

namespace App\DTO;

class PasswordResetDTO
{
    /**
     * @var string|null
     */
    private $newPassword;

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
