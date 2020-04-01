Vagrant.configure("2") do |config|
    config.vm.box = "archlinux/archlinux"

    config.vm.synced_folder "backend", "/home/vagrant/backend"
    config.vm.synced_folder "schema", "/home/vagrant/schema"
    config.vm.synced_folder "devenv", "/home/vagrant/devenv"
    config.vm.synced_folder ".aws", "/home/vagrant/.aws"

    config.vm.provision "file", source: ".python-version", destination: "/home/vagrant/.python-version"
    config.vm.provision "file", source: "docker-compose.yml", destination: "/home/vagrant/docker-compose.yml"
    config.vm.provision "file", source: ".zshrc", destination: "/home/vagrant/.zshrc"
    config.vm.provision "file", source: ".Makefile", destination: "/home/vagrant/Makefile"

    config.vm.network "forwarded_port", guest: 4000, host: 4000
    config.vm.network "forwarded_port", guest: 5432, host: 5432

    config.vm.provider "libvirt" do |v|
        v.memory = 4096
        v.cpus = 6
    end

    config.vm.provider "virtualbox" do |v|
        v.memory = 4096
        v.cpus = 6
    end

    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "devplaybook.yml"
    end
end