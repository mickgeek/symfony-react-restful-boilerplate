<?php

namespace App\Form\Type;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\{NotBlank, Length};
use Symfony\Component\Security\Core\Validator\Constraints\UserPassword;
use App\DTO\PasswordChangeDTO;

class PasswordChangeType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('currentPassword', null, ['constraints' => [
                new NotBlank(),
                new UserPassword(),
            ]])
            ->add('newPassword', null, ['constraints' => [
                new NotBlank(),
                new Length(['min' => 4]),
            ]]);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PasswordChangeDTO::class,
            'csrf_protection' => false,
        ]);
    }
}
