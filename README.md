# Merenciano Calhas

Landing page responsiva em HTML, CSS e JavaScript, sem dependências de terceiros.

## Prévia local

Você pode abrir `index.html` diretamente no navegador. Com Node.js instalado, também pode executar `npm start` nesta pasta e abrir `http://127.0.0.1:4173`; o servidor local oferece suporte a solicitações de intervalo para a reprodução do vídeo.

## Vídeo da hero

O vídeo já fornecido foi colocado em `public/videos/hero-merenciano.mp4`. Para usar uma versão nova, coloque ou renomeie o arquivo MP4 para esse mesmo caminho. Ele toca uma vez sem áudio; ao terminar, os textos da abertura aparecem e o vídeo continua em loop. Se o navegador bloquear a reprodução ou o visitante preferir menos movimento, a página mostra `public/images/hero-fallback.jpg`.

Substitua também `public/images/hero-fallback.jpg` por uma imagem horizontal de fallback quando houver uma versão oficial. Preserve o nome do arquivo para manter os caminhos e o carregamento antecipado.

## Contatos e redes

- O número oficial de WhatsApp está centralizado em `app.js` (`WHATSAPP_URL`) e os links incluem mensagens próprias para cada serviço.
- O link do Facebook está preparado em `app.js` na constante `FACEBOOK_URL`. Adicione ali a URL oficial quando ela estiver disponível; o ícone só fica ativo quando há um endereço configurado.
- O endereço do Instagram e o e-mail foram fornecidos no briefing.

## Imagens e avaliações

O arquivo `public/images/logo-merenciano.png` contém o logo anexado pela empresa e é usado no cabeçalho e no rodapé. A arte `public/images/telhado-bem-cuidado.png` é exibida inteira na seção de chamada para orçamento. As avaliações identificadas nas capturas anexadas foram transcritas para cards; trechos sem autor ou cortados não foram publicados.

As cinco fotos dos serviços e a imagem de fallback continuam em `public/images/`.
