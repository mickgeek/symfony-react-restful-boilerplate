<?php

namespace App\Form\Type;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface};
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\{NotBlank, Length, Email, Url};
use App\DTO\EmailChangeDTO;
use App\Validator\Constraint\{NotCurrentUserEmail, UniqueUserEmail};

class EmailChangeType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('newEmail', null, ['constraints' => [
                new NotBlank(),
                new Length(['max' => 100]),
                new Email(),
                new NotCurrentUserEmail(),
                new UniqueUserEmail(),
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
            'data_class' => EmailChangeDTO::class,
            'csrf_protection' => false,
        ]);
    }
}
