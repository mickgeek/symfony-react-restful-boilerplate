<?php

namespace App\Form\Type;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\{NotBlank, Email, Url};
use App\DTO\PasswordResetRequestDTO;
use App\Validator\Constraint\IsUserStatusActive;

class PasswordResetRequestType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', null, ['constraints' => [
                new NotBlank(),
                new Email(),
                new IsUserStatusActive(),
            ]])
            ->add('appURL', null, ['constraints' => [
                new NotBlank(),
                new Url(),
            ]]);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PasswordResetRequestDTO::class,
            'csrf_protection' => false,
        ]);
    }
}
