<?php

namespace App\Form\Util;

use Symfony\Component\Form\Form;

class FormHelper
{
    /**
     * @param Form $form
     *
     * @return array
     */
    public function convertErrors(Form $form): array
    {
        return $this->convertErrorsAsArray($form);
    }

    /**
     * @param Form $form
     *
     * @return array
     */
    private function convertErrorsAsArray(Form $form): array
    {
        $errors = [];
        foreach ($form->getErrors() as $error) {
            $errors[] = $error->getMessage();
        }
        foreach ($form->all() as $key => $child) {
            $error = $this->convertErrorsAsArray($child);
            if (count($error) > 0) {
                $errors[$key] = $error;
            }
        }

        return $errors;
    }
}
