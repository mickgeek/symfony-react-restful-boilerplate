<?php

namespace App\Validator\Constraint;

use Symfony\Component\Validator\{ConstraintValidator, Constraint};
use Symfony\Component\Validator\Exception\ValidatorException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class NotCurrentUserEmailValidator extends ConstraintValidator
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * {@inheritdoc}
     *
     * @throws ValidatorException
     */
    public function validate($value, Constraint $constraint)
    {
        if ($value === null || $value === '' || !preg_match('/^.+@\S+\.\S+$/', $value)) {
            return;
        }

        $user = $this->tokenStorage->getToken()->getUser();
        if (is_object($user)) {
            $user->getEmail() !== $value ?: $this->context->buildViolation('This email address is your current.')->addViolation();
        } else {
            throw new ValidatorException('User not authenticated.');
        }
    }
}
