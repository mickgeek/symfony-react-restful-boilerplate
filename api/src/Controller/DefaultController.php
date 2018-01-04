<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as Config;

class DefaultController
{
    /**
     * @Config\Route("/", name="default_index")
     * @Config\Method("GET")
     * @Config\Security("is_granted('IS_AUTHENTICATED_ANONYMOUSLY')")
     *
     * @return JsonResponse
     */
    public function index()
    {
        return new JsonResponse();
    }
}
