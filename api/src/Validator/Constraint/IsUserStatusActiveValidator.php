<?php

namespace App\Validator\Constraint;

use Symfony\Component\Validator\{ConstraintValidator, Constraint};
use App\Repository\UserRepository;
use App\Entity\User;

class IsUserStatusActiveValidator extends ConstraintValidator
{
    /**
     * @var UserRepository
     */
    private $repository;

    /**
     * @param UserRepository $repository
     */
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * {@inheritdoc}
     */
    public function validate($value, Constraint $constraint)
    {
        if ($value === null || $value === '' || !preg_match('/^.+@\S+\.\S+$/', $value)) {
            return;
        }

        $user = $this->repository->findOneByEmail($value);
        if ($user === null) {
            $this->context->buildViolation('User not found.')->addViolation();

            return;
        }

        switch ($user->getStatus()) {
            case User::STATUS_INACTIVE:
                $this->context->buildViolation('Account is inactive.')->addViolation();
                break;
            case User::STATUS_CLOSED:
                $this->context->buildViolation('Account is closed.')->addViolation();
                break;
            case User::STATUS_BLOCKED:
                $this->context->buildViolation('Account is blocked.')->addViolation();
                break;
        }
    }
}
