export const revalidate = 86400;

export default function PoliticaEditorialPage() {
  return (
    <div className="max-page px-page py-16">
      <div className="max-w-[740px]">
        <span className="badge mb-6 inline-flex">Política Editorial</span>

        <h1 className="font-display text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.15] tracking-[-0.02em] text-text mb-6 text-balance">
          Como produzimos nosso conteúdo
        </h1>

        <div className="prose">
          <h2>Processo editorial</h2>
          <p>
            Todo conteúdo publicado neste portal passa por curadoria editorial e revisão antes da
            publicação. Nossa equipe verifica cada artigo para garantir precisão e qualidade
            jornalística.
          </p>

          <h2>Fontes e verificação factual</h2>
          <p>
            Priorizamos fontes primárias: estudos científicos, dados oficiais, relatórios de mercado
            e declarações diretas. Sempre que possível, linkamos para a fonte original.
          </p>

          <h2>Conflito de interesses</h2>
          <p>
            Conteúdo patrocinado e anúncios são sempre identificados visualmente como "Publicidade".
            Nossa linha editorial é independente de anunciantes.
          </p>

          <h2>Correções</h2>
          <p>
            Erros são corrigidos publicamente com nota de correção no artigo original. Entre em
            contato pelo nosso email para reportar imprecisões.
          </p>

          <h2>Privacidade e dados</h2>
          <p>
            Coletamos apenas os dados necessários para a operação do site e da newsletter. Não
            vendemos informações de leitores a terceiros.
          </p>
        </div>
      </div>
    </div>
  );
}
