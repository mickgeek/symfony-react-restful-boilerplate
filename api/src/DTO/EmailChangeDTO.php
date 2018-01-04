<?php

namespace App\DTO;

class EmailChangeDTO
{
    /**
     * @var string|null
     */
    private $newEmail;

    /**
     * @var string|null
     */
    private $appURL;

    /**
     * @param string $newEmail
     */
    public function setNewEmail(string $newEmail)
    {
        $this->newEmail = $newEmail;
    }

    /**
     * @return string|null
     */
    public function getNewEmail(): ?string
    {
        return $this->newEmail;
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
