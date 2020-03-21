source ~/antigen.zsh

antigen use oh-my-zsh

antigen bundle git
antigen bundle vi-mode

antigen bundle zsh-users/zsh-syntax-highlighting
antigen bundle zsh-users/zsh-completions

antigen theme robbyrussell

antigen apply

eval "$(pyenv init -)"