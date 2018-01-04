<?php

namespace App\Validator\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueUserEmail extends Constraint
{
    /**
     * @var array
     */
    private $excludedValues = [];

    /**
     * {@inheritdoc}
     */
    public function __construct($options = null)
    {
        if (isset($options['excludedValues'])) {
            $this->excludedValues = $options['excludedValues'];
            unset($options['excludedValues']);
        }

        parent::__construct($options);
    }

    /**
     * @return array
     */
    public function getExcludedValues(): array
    {
        return $this->excludedValues;
    }
}
