<?php

namespace App\DTO;

class RegistrationDTO
{
    /**
     * @var string|null
     */
    private $email;

    /**
     * @var string|null
     */
    private $password;

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
     * @param string $password
     */
    public function setPassword(string $password)
    {
        $this->password = $password;
    }

    /**
     * @return string|null
     */
    public function getPassword(): ?string
    {
        return $this->password;
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
