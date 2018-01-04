<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\{InputInterface, InputArgument};
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;
use App\Repository\UserRepository;

class CreateSuperAdminCommand extends Command
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param UserPasswordEncoderInterface $encoder
     * @param UserRepository $userRepository
     */
    public function __construct(UserPasswordEncoderInterface $encoder, UserRepository $userRepository)
    {
        $this->encoder = $encoder;
        $this->userRepository = $userRepository;

        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('app:create-super-admin')
            ->setDescription('Creates a super administrator.')
            ->setHelp('This command allows you to create a user with a special role and privileged rights.')
            ->addArgument('email', InputArgument::REQUIRED, 'The email of the user.')
            ->addArgument('password', InputArgument::REQUIRED, 'The password of the user.');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $user = new User($input->getArgument('email'), User::ROLE_SUPER_ADMIN, User::STATUS_ACTIVE);
        $user->setPasswordHash($this->encoder->encodePassword($user, $input->getArgument('password')));
        $this->userRepository->add($user);

        $output->writeln('The super administrator has been created successfully.');
    }
}
