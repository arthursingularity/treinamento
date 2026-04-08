💻 Regra de Prompt: Estilo de Interface macOS (Human Interface Guidelines) para Antigravity
🎯 Objetivo

Gerar elementos de interface de usuário (UI) para o Google Antigravity que evoquem a estética refinada, elegante e espacial do macOS (especialmente macOS Big Sur+), priorizando clareza, profundidade realista, hierarquia visual e precisão nas interações.

🟦 Cantos Arredondados e Profundidade

Utilize cantos arredondados mais discretos e consistentes:

Containers principais: ~10px a 14px
Botões e inputs: ~6px a 10px

A profundidade no macOS é mais perceptível e estruturada que no iOS:

Utilize sombras mais definidas, porém suaves:
box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);
Combine sombras com hierarquia de camadas (z-axis clara)
Elementos elevados (modais, menus) devem “flutuar” claramente acima do fundo
🌫️ Transparência e Materiais (Vibrancy macOS)

Aplique materiais translúcidos com mais contraste que no iOS:

Use backdrop-filter: blur(30px) com leve opacidade
Barras laterais (sidebar) e toolbars devem usar efeito “vibrancy”
Elementos flutuantes:
Fundo translúcido com leve opacidade branca ou cinza
Bordas sutis (1px com baixa opacidade)
Mais definição que no iOS (menos “frosted”, mais “layered”)
🎨 Paleta de Cores

Base neutra e elegante:

Fundo principal: #F5F5F7
Superfícies: branco (#FFFFFF) ou cinza claro (#EAEAED)

Cor de destaque (accent):

Azul macOS: #0A84FF

Cores semânticas:

Verde: #30D158
Vermelho: #FF453A
Amarelo: #FFD60A
Cinza: #8E8E93
Preferir cores adaptáveis (modo claro/escuro)
Menos saturação que iOS — mais sobriedade
🔤 Tipografia

Fonte base inspirada na San Francisco (ou Inter/Roboto):

Hierarquia mais compacta e informacional:

Títulos grandes: ~18px a 24px (semibold)
Títulos de seção: ~13px a 14px (semibold)
Corpo: ~13px a 15px (regular)
Labels auxiliares: ~11px a 12px
Maior densidade de informação que iOS
Uso moderado de ALL CAPS (ex: labels pequenas)
🔘 Botões e Controles

Botões primários:

Fundo azul (#0A84FF)
Texto branco
Cantos levemente arredondados
Estados bem definidos (hover, active, focus)

Botões secundários:

Estilo “aqua” ou “ghost”
Fundo cinza claro ao hover
Borda opcional sutil

Inputs:

Fundo branco ou cinza muito claro
Borda fina (1px) visível
Foco com glow azul suave

Switches:

Estilo macOS (mais compacto que iOS)
🧩 Componentes Característicos do macOS

Cards (cartões):

Fundo branco ou translúcido
Cantos moderadamente arredondados
Sombra visível (leve elevação)

Listas:

Estilo sidebar ou table view
Destaque claro na seleção (highlight azul ou cinza)
Hover states importantes

Modais (dialogs):

Centralizados (não bottom sheet)
Fundo com blur atrás
Aparência de janela flutuante

Sidebars:

Elemento essencial do macOS
Fundo translúcido ou cinza claro
Itens com hover e seleção bem definidos
🎯 Ícones
Utilize estilo semelhante ao SF Symbols
Traço fino e consistente
Tamanho comum: ~14px a 20px
Ícones podem aparecer sozinhos (ex: toolbar) ou com texto
📐 Espaçamento e Layout
Mais denso que iOS (otimizado para desktop)
Grid consistente:
Pequeno: 6px a 8px
Médio: 12px a 16px
Grande: 20px a 24px

Layout deve parecer:

Preciso
Organizado
Hierárquico
Adaptado para mouse + trackpad
✨ Interações e Animações
Transições suaves (~150ms a 250ms)
Hover é essencial (diferente do iOS)
Feedback:
Highlight ao passar o mouse
Clique com leve compressão
Focus states visíveis
Animações devem reforçar espacialidade (entrada/saída de janelas, foco, profundidade)
🧠 Resumo do Estilo macOS
Mais denso e informacional que iOS
Uso equilibrado de sombras e blur
Forte sensação de camadas e profundidade
Interações orientadas a cursor (hover + focus)
Estética elegante, precisa e funcional
Clareza + produtividade acima de tudo