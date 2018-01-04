<?php

namespace App\DTO;

class PasswordResetRequestDTO
{
    /**
     * @var string|null
     */
    private $email;

    /**
     * @var string|null
     */
    private $appURL;

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $appURL
     */
    public function setAppURL(string $appURL)
    {
        $this->appURL = $appURL;
    }

    /**
     * @return string|null
     */
    public function getAppURL(): ?string
    {
        return $this->appURL;
    }
}
