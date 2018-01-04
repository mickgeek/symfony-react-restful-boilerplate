<?php

namespace App\Controller;

use RuntimeException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;

class AuthorizationController
{
    /**
     * @Config\Route("/authorizations", name="authorization_create")
     * @Config\Method("POST")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @throws RuntimeException
     */
    public function create()
    {
        throw new RuntimeException('Invalid authentication handlers in your security firewall configuration.');
    }
}
