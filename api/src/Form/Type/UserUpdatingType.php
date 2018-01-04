<?php

namespace App\Form\Type;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\{NotBlank, Length, Email, Choice};
use App\DTO\UserDTO;
use App\Entity\User;
use App\Validator\Constraint\UniqueUserEmail;

class UserUpdatingType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', null, ['constraints' => [
                new NotBlank(),
                new Length(['max' => 100]),
                new Email(),
                new UniqueUserEmail(['excludedValues' => [$options['currentEmail']]]),
            ]])
            ->add('password', null, ['constraints' => [
                new Length(['min' => 4]),
            ]])
            ->add('role', IntegerType::class, ['constraints' => [
                new NotBlank(),
                new Choice([
                    'choices' => [
                        User::ROLE_USER,
                        User::ROLE_SUPER_ADMIN,
                    ],
                    'strict' => true,
                ]),
            ]])
            ->add('status', IntegerType::class, ['constraints' => [
                new NotBlank(),
                new Choice([
                    'choices' => [
                        User::STATUS_INACTIVE,
                        User::STATUS_CLOSED,
                        User::STATUS_BLOCKED,
                        User::STATUS_ACTIVE,
                    ],
                    'strict' => true,
                ]),
            ]]);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => UserDTO::class,
            'csrf_protection' => false,
            'currentEmail' => null,
        ]);
    }
}
