<?php

namespace App\Form\Type;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\{NotBlank, Length, Email, Url};
use App\DTO\RegistrationDTO;
use App\Validator\Constraint\UniqueUserEmail;

class RegistrationType extends AbstractType
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
                new UniqueUserEmail(),
            ]])
            ->add('password', null, ['constraints' => [
                new NotBlank(),
                new Length(['min' => 4]),
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
            'data_class' => RegistrationDTO::class,
            'csrf_protection' => false,
        ]);
    }
}
