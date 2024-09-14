const {
  DynamoDBDocumentClient,
  PutCommand,
} = require('@aws-sdk/lib-dynamodb');

const { dynamodb } = require('./dynamodb');

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamodb);

const sendMultipleItems = async (items) => {
  items.map(async(item) => {
    const command = new PutCommand({
      TableName: 'processos',
      Item: item,
    })
   
    const data = await dynamoDBDocClient.send(command);
    console.log('Itens enviados com sucesso:', data);
  })
  
};

// Exemplo de uso
// Exemplo de uso
const items = [
  {
    processId: "1",
    title: "Aceleração de diploma",
    description: "Processo que se destina a acelerar o trâmite de análise e registro de pedido de diploma de conclusão de curso, já em andamento.",
    documentsRequired: [
      "documento(s) comprobatório(s) da necessidade de aceleração, tais como carta de empregabilidade ou comprovante de mudança de domicílio fora do Estado ou Edital de aprovação em curso de pós-graduação ou nomeação para concurso, etc.",
      "declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "CCA > DCAD"
  },
  {
    processId: "2",
    title: "Acompanhamento domiciliar",
    description: "Pedido de atendimento às atividades pedagógicas no próprio domicílio do estudante em decorrência de problemas de saúde ou licença maternidade.",
    documentsRequired: [
      "Laudo ou atestado médico com data de início e fim do afastamento",
      "declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Gabinete Médico ou coordenação do curso (a depender da estrutura do Campus)"
  },
  {
    processId: "3",
    title: "Ajuda de custo para participação em eventos",
    description: "Solicitação de ajuda de custo para participação em eventos.",
    documentsRequired: [
      "Documentação, conforme edital",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação de Curso > Professor/Setor de acompanhamento"
  },
  {
    processId: "4",
    title: "Ajuste de matrícula em disciplina(s)",
    description: "Pedido de matrícula em disciplinas fora do período definido em calendário para matrículas de estudantes veteranos, ou matrícula em situação especial para cursar disciplinas equivalentes em cursos diferentes, ou ainda para ajuste de horários, etc.",
    documentsRequired: [],
    flow: "Coordenação do Curso"
  },
  {
    processId: "5",
    title: "Ajuste em projeto de pesquisa a partir de 2018",
    description: "Ajuste em projeto de pesquisa a partir de 2018.",
    documentsRequired: [],
    flow: "Coordenação do curso de origem > Coordenação do curso de destino"
  },
  {
    processId: "6",
    title: "Ajuste em projeto de pesquisa anterior a 2018",
    description: "Ajuste em projeto de pesquisa anterior a 2018.",
    documentsRequired: [],
    flow: "Coordenação do curso de origem > Coordenação do curso de destino"
  },
  {
    processId: "7",
    title: "Antecipação de colação de grau (extemporânea)",
    description: "Pedido de realização da cerimônia de colação de grau em caráter extraordinário (extemporâneo). Para abertura deste processo o pedido de colação de grau e diploma de curso superior deverá ter sido previamente solicitado, conforme normas regimentais e administrativas.",
    documentsRequired: [
      "Justificativa documental, tais como carta de empregabilidade ou comprovante de mudança de domicílio fora do Estado ou Edital de aprovação em curso de pós-graduação ou nomeação para cargo em concurso público, etc.",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > DES ou DDE > DG > CCA"
  },
  {
    processId: "8",
    title: "Auxílio óculos",
    description: "Pedido de óculos.",
    documentsRequired: [
      "Documentação, conforme edital",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "9",
    title: "Cadastro de nome social",
    description: "Pedido de cadastro de nome social.",
    documentsRequired: [],
    flow: "CCA"
  },
  {
    processId: "10",
    title: "Cadastro do estágio dos cursos técnicos e superiores (formalização do estágio inicial)",
    description: "Formalização do estágio pelos estudantes.",
    documentsRequired: [
      "Requerimento solicitando a inscrição no estágio",
      "ficha de inscrição em estágio preenchida e assinada",
      "termo de compromisso (quando couber)",
      "termo aditivo (anexo I da Instrução Normativa 1/2020 (devidamente assinado)",
      "termo de conhecimento e concordância (anexo III da Instrução Normativa 1/2020 (devidamente assinado)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação de Estágio > Coordenação do Curso > Coordenação de Estágio"
  },
  {
    processId: "11",
    title: "Cancelamento voluntário de matrícula de estudante ingressante",
    description: "Pedido voluntário de cancelamento para estudante recém-ingresso na instituição que, por qualquer razão, não deseja mais ocupar a vaga. Considera-se ingressante o estudante que ingressou na instituição há menos de 15 dias corridos, a contar da data de efetivação da matrícula no sistema acadêmico.",
    documentsRequired: [],
    flow: "CCA"
  },
  {
    processId: "12",
    title: "Cancelamento voluntário de matrícula de estudante veterano",
    description: "Pedido voluntário de cancelamento para estudante veterano da instituição que, por qualquer razão, não deseja mais continuar os estudos no respectivo curso.",
    documentsRequired: [
      "Documentos comprobatórios de que não possui pendências com os setores Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > Nada Consta > Coordenação do Curso > CCA"
  },
  {
    processId: "13",
    title: "Certificação de conhecimento - aceleração de estudos (técnico)",
    description: "Destina-se à aceleração dos estudos em componentes curriculares, no âmbito dos cursos técnicos. Regulamentada por meio de publicação de Edital institucional.",
    documentsRequired: [],
    flow: "Coordenação do Curso"
  },
  {
    processId: "14",
    title: "Certificado de conclusão de curso (especialização)",
    description: "Solicitação de emissão do certificado de conclusão do curso de pós-graduação Lato Sensu, após o cumprimento de todos os requisitos do curso.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor",
      "Certidão de Quitação Eleitoral disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino)",
      "Diploma de conclusão de curso superior, acompanhado do histórico escolar do respectivo curso de graduação",
      "Declaração da biblioteca informando o depósito da versão final do Trabalho de Conclusão do Curso",
      "Declaração de liberação de direitos autorais para publicação em repositório digital",
      "Comprovação de submissão de artigo para publicação",
      "Documentos comprobatórios de que não possui pendências com os setores Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração da Coordenação do Curso do cumprimento dos requisitos exigidos para conclusão",
      "Cópia da Ata de defesa do TCC",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III)"
    ],
    flow: "Coordenação do Curso > Nada Consta > Coordenação do curso > CCA > PRPIPG > CCA"
  },
  {
    processId: "15",
    title: "Colação de grau e diploma de curso superior",
    description: "Solicitação de emissão do diploma de conclusão de curso superior, após o cumprimento de todos os requisitos do curso.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor (maiores de 18 anos na data da solicitação)",
      "Certidão de Quitação Eleitoral (maiores de 18 anos na data da solicitação) disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino, maiores de 18 anos na data da solicitação)",
      "Certificado e Histórico Escolar de conclusão do Ensino Médio",
      "Documentos comprobatórios de que não possui pendências com os setores Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do curso > NADA CONSTA > Coordenação do curso CCA > DG > CCA > DCAD"
  },
  {
    processId: "16",
    title: "Declaração de boa conduta",
    description: "Presta-se à solicitação de declaração institucional que informa sobre a ausência de pendências disciplinares do estudante.",
    documentsRequired: [],
    flow: "Coordenação do Curso"
  },
  {
    processId: "17",
    title: "Declaração de vínculo com o IF",
    description: "Solicitação de declaração para comprovar vínculo com o Instituto Federal, por exemplo, para fins de participação em atividades como aluno egresso.",
    documentsRequired: [],
    flow: "CCA"
  },
  {
    processId: "18",
    title: "Discriminação de disciplinas já cursadas em instituição de ensino superior",
    description: "Análise e validação de disciplinas já cursadas em outras instituições de ensino superior para o fim de aproveitamento e/ou equivalência no curso atual.",
    documentsRequired: [
      "Histórico Escolar",
      "Programas das disciplinas cursadas",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "19",
    title: "Diploma de ensino médio",
    description: "Solicitação de emissão do diploma de conclusão do ensino médio.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor",
      "Certidão de Quitação Eleitoral disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > Secretaria de Educação > Coordenação do Curso > CCA"
  },
  {
    processId: "20",
    title: "Emissão de histórico escolar",
    description: "Solicitação de emissão do histórico escolar do estudante.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor",
      "Certidão de Quitação Eleitoral disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > CCA"
  },
  {
    processId: "21",
    title: "Diploma de conclusão de curso técnico",
    description: "Solicitação de emissão do diploma de conclusão de curso técnico, após o cumprimento de todos os requisitos do curso.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor (maiores de 18 anos na data da solicitação)",
      "Certidão de Quitação Eleitoral (maiores de 18 anos na data da solicitação) disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino, maiores de 18 anos na data da solicitação)",
      "Certificado e Histórico Escolar de conclusão do Ensino Fundamental para Cursos Técnicos Integrados, ou Certificado e Histórico de conclusão do Ensino Médio para solicitações de diplomas de Cursos Técnicos Subsequentes",
      "Documentos comprobatórios de que não possui pendências com os setores Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do curso > NADA CONSTA > Coordenação do curso > DG > CCA > DCAD"
  },
  {
    processId: "22",
    title: "Diploma de mestrado",
    description: "Solicitação de emissão do diploma de conclusão do curso de pós-graduação Stricto Sensu, após o cumprimento de todos os requisitos do curso.",
    documentsRequired: [
      "Certidão de Nascimento ou Casamento",
      "Documento de identificação civil (conforme disposto na Resolução AR 23/2022-CONSUPER/IFPB)",
      "CPF",
      "Título de Eleitor",
      "Certidão de Quitação Eleitoral disponível no site do TSE ou TREs",
      "Comprovante de Quitação Militar (indivíduos do sexo masculino)",
      "Diploma de conclusão de curso superior, acompanhado do histórico escolar do curso de graduação",
      "Declaração da biblioteca informando o depósito da versão final do Trabalho de Conclusão do Curso",
      "Declaração de liberação de direitos autorais para publicação em repositório digital",
      "Declaração da Coordenação do Curso do cumprimento dos requisitos exigidos para conclusão",
      "Cópia da Ata de defesa do TCC",
      "Documentos comprobatórios de que não possui pendências com os setores Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (anexo III)"
    ],
    flow: "Coordenação do Curso > CCA > DCAD"
  },
  {
    processId: "23",
    title: "Dispensa das atividades práticas de educação física",
    description: "Solicitação de dispensa ao atendimento das atividades práticas de Educação Física, em virtude de problema de saúde, idade ou portador de deficiência que impossibilite o atendimento às atividades práticas.",
    documentsRequired: [
      "Laudo Médico",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Gabinete Médico ou coordenação do curso (a depender da estrutura do Campus)"
  },
  {
    processId: "24",
    title: "Entrega da Folha de Ponto (Monitoria)",
    description: "Destina-se ao Monitor para comprovação das atividades executadas.",
    documentsRequired: [
      "Folha de Ponto",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > DDE"
  },
  {
    processId: "25",
    title: "Entrega de Projeto",
    description: "Submissão de Projeto de TCC.",
    documentsRequired: [
      "Projeto em PDF",
      "Histórico",
      "Formulário de anuência do orientador",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação de Curso > Professor/Setor de acompanhamento"
  },
  {
    processId: "26",
    title: "Entrega de relatório de estágio",
    description: "Processo que se destina à submissão do relatório final de avaliação de Estágio curricular obrigatório ou não.",
    documentsRequired: [
      "Relatório final de Estágio",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > Parecer do Professor Orientador > Coordenação do Curso > Coordenação de Estágio"
  },
  {
    processId: "27",
    title: "Entrega de Trabalho de Conclusão de Curso",
    description: "Processo que se destina à submissão da versão final do Trabalho de Conclusão do Curso à Coordenação do curso e, posteriormente, para submissão ao(s) repositórios digitais.",
    documentsRequired: [
      "Trabalho de Conclusão do Curso",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > Parecer do Professor Orientador > Coordenação do Curso > Biblioteca > Coordenação do Curso"
  },
  {
    processId: "28",
    title: "Entrega do Relatório Final (Monitoria)",
    description: "Destina-se ao Monitor para comprovação das atividades executadas e posterior recebimento do certificado/declaração.",
    documentsRequired: [
      "Relatório Final de Monitoria",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > DDE > CCA"
  },
  {
    processId: "29",
    title: "Impugnação de Edital",
    description: "Solicita impugnação de edital.",
    documentsRequired: [
      "Documentação, conforme edital",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "DDE"
  },
  {
    processId: "30",
    title: "Marcação de defesa de dissertação",
    description: "Destina-se ao estabelecimento da data para apresentação do Trabalho de Conclusão do Curso de mestrado.",
    documentsRequired: [
      "Requerimento de solicitação assinado por mestrando e seu orientador",
      "Composição da banca examinadora com dados de identificação (nome, CPF e instituição)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "31",
    title: "Marcação de qualificação de dissertação",
    description: "Destina-se ao estabelecimento da data para apresentação do Projeto de Pesquisa para o curso de mestrado.",
    documentsRequired: [
      "Requerimento de solicitação assinado por mestrando e seu orientador",
      "Composição da banca examinadora com identificação (nome, CPF e instituição)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "32",
    title: "Matrícula para manutenção de vínculo",
    description: "Presta-se à manutenção do vínculo do estudante com a instituição para fins de conclusão de Estágio Curricular obrigatório e/ou TCC, na situação em que já houve integralização da carga horária obrigatória em disciplinas.",
    documentsRequired: [
      "Carta de aceite da orientação",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "33",
    title: "Mudança de orientador de TCC",
    description: "Pedido de substituição de orientador de Trabalho de Conclusão de Curso.",
    documentsRequired: [
      "Requerimento assinado",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "34",
    title: "Prorrogação de prazo para defesa de dissertação",
    description: "Pedido de dilatação de prazo para conclusão de curso de mestrado.",
    documentsRequired: [
      "Requerimento de prorrogação de prazo preenchido com justificativa e novo cronograma assinado por mestrando e seu orientador",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "35",
    title: "Pedido de matrícula em disciplina de outro curso",
    description: "Solicitação para matrícula em disciplina de outro curso.",
    documentsRequired: [],
    flow: "Coordenação do curso de origem > Coordenação do curso de destino"
  },
  {
    processId: "36",
    title: "Prorrogação de prazo para qualificação de dissertação",
    description: "Pedido de dilatação de prazo para apresentação do Projeto de Pesquisa de curso de mestrado.",
    documentsRequired: [
      "Requerimento de prorrogação de prazo preenchido com justificativa e novo cronograma assinado por mestrando e seu orientador",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "37",
    title: "Reconhecimento de competências/conhecimentos adquiridos",
    description: "Pedido de reconhecimento de habilidades, conhecimentos, saberes e competências adquiridos por meio de cursos formais ou advindos do exercício profissional na área de conhecimento.",
    documentsRequired: [
      "Conforme edital",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso/Área"
  },
  {
    processId: "38",
    title: "Registro de propriedade intelectual",
    description: "Pedido de registro de propriedade intelectual.",
    documentsRequired: [
      "Documentação específica",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "DDE"
  },
  {
    processId: "39",
    title: "Reintegração de matrícula (Cursos Técnicos)",
    description: "Pedido de retorno ao curso (reingresso) para estudantes desligados da instituição por motivo de evasão ou de cancelamento, passíveis de análise.",
    documentsRequired: [
      "Documento contendo justificativa do motivo do afastamento do estudante (Anexar outros documentos comprobatórios, caso existam)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "40",
    title: "Reingresso de estudante por jubilamento ou cancelamento de matrícula",
    description: "Pedido de reingresso, conforme Regulamento Didático dos Cursos Superiores.",
    documentsRequired: [
      "Justificativa para o retorno",
      "Proposta de cronograma para conclusão do curso",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação de curso"
  },
  {
    processId: "41",
    title: "Relatório de bolsa de mestrado",
    description: "Processo que se destina à submissão do relatório de atividades desenvolvidas no período de recebimento de bolsa de fomento.",
    documentsRequired: [
      "Formulário em conformidade com os artigos 8º e 9º da Resolução 66/2021/CS/IFPB",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação de Curso"
  },
  {
    processId: "42",
    title: "Reposição de avaliações",
    description: "Pedido de reposição de avaliação.",
    documentsRequired: [
      "Requerimento assinado especificando a disciplina a qual requer reposição de avaliação",
      "Documentação que comprove ou justifique a ausência conforme Regimento Didático do curso o qual o aluno está matriculado",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "43",
    title: "Residência pedagógica na forma de estágio supervisionado",
    description: "Pedido de aproveitamento do exercício de residência pedagógica, no âmbito das licenciaturas, em substituição ao Estágio Curricular Obrigatório.",
    documentsRequired: [
      "Relatório das Atividades da Residência Pedagógica acompanhado da declaração de cumprimento de carga horária mínima exigida",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "44",
    title: "Segunda via de diploma",
    description: "Emissão de segunda via de diploma em virtude de perda ou extravio do documento original (para egressos do sistema SUAP).",
    documentsRequired: [
      "Boletim de Ocorrência atestando a perda ou extravio da 1ª via",
      "Carteira de identidade (RG) emitida por órgãos de identificação; Carteira de Trabalho e Previdência Social - CTPS; Carteira Nacional de Habilitação - CNH; Carteira de identidade profissional expedida por órgãos fiscalizadores de exercício de profissão regulamentada (OAB, CRC, CRM, CRA, CREA etc.); Carteiras funcionais emitidas por órgãos públicos (desde que reconhecida por Lei Federal como documento oficial de identidade válido em todo território nacional); Documento de identificação militar",
      "Certidão de Nascimento ou Casamento",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "CCA > DCAD"
  },
  {
    processId: "45",
    title: "Seleção para estágio não obrigatório",
    description: "Solicitação de seleção para estágio não obrigatório.",
    documentsRequired: [],
    flow: "Coordenação de estágio"
  },
  {
    processId: "46",
    title: "Solicitação de Ementa/Plano de curso de disciplina cursada",
    description: "Pedido para obter a ementa ou plano de curso de disciplina cursada.",
    documentsRequired: [],
    flow: "Coordenação de curso"
  },
  {
    processId: "47",
    title: "Trancamento de interrupção de estudos com edital",
    description: "Interrupção de estudos para os estudantes de cursos superiores, durante o período de ajuste de matrícula, caso ele não possa cursar nenhuma disciplina em um determinado período letivo, em prazo não superior à diferença entre os tempos máximos e mínimos exigidos para conclusão do curso.",
    documentsRequired: [
      "Conforme solicitação do Edital de interrupção de estudos",
      "Documentos comprobatórios de que não possui pendências com os setores de Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > NADA CONSTA > Coordenação do Curso"
  },
  {
    processId: "48",
    title: "Trancamento de matrícula para realização de intercâmbio",
    description: "Solicitação de trancamento de matrícula para realização de Intercâmbio Nacional ou Internacional, através de Programas do Governo Federal ou no âmbito do IFPB.",
    documentsRequired: [
      "Documento comprobatório da aprovação em Programa de Mobilidade Acadêmica, de acordo com a legislação vigente e conforme Regimento Didático para os Cursos Superiores Presenciais e à Distância",
      "Documentos comprobatórios de que não possui pendências com os setores de Biblioteca, Financeiro e Assistência Estudantil (“Nada consta”)",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "49",
    title: "Trancamento voluntário de disciplina",
    description: "Pedido de trancamento voluntário em componente curricular. Este tipo de trancamento poderá ser solicitado pelo discente no máximo 2 vezes por disciplina para Cursos Superiores, e apenas 1 vez para Cursos Técnicos. Caso seja trancamento do primeiro período, deverá se enquadrar nos regulamentos didáticos.",
    documentsRequired: [
      "No caso de disciplina do período de ingresso (1º período), documentos que justifiquem trabalho formal, Gravidez de Risco, doença prolongada, mudança de domicílio, ou outra situação prevista nos regulamentos didáticos",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso"
  },
  {
    processId: "50",
    title: "Trancamento voluntário do período letivo",
    description: "Trancamento voluntário total do período letivo. Caso seja trancamento do período inicial do curso, deverá se enquadrar nos regulamentos didáticos.",
    documentsRequired: [
      "No caso de disciplina do período de ingresso (1º período), documentos que justifiquem trabalho formal, Gravidez de Risco, doença prolongada, mudança de domicílio, ou outra situação prevista nos regulamentos didáticos",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "Coordenação do Curso > NADA CONSTA > Coordenação do Curso (ver avaliação médica se for o caso)"
  },
  {
    processId: "51",
    title: "Transferência para outra instituição (transferência externa)",
    description: "Transferência para outro Curso Técnico em outra Instituição de Ensino ou outro Instituto Federal.",
    documentsRequired: [
      "Declaração de existência de vaga na instituição de destino",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "DDE > Coordenação do Curso > NADA CONSTA > Coordenação do Curso > CCA"
  },
  {
    processId: "52",
    title: "Transferência para outro Campus do IFPB (transferência intercâmpus)",
    description: "Transferência para o mesmo Curso Técnico ou outro curso no âmbito do IFPB, (mediante adaptação curricular).",
    documentsRequired: [
      "Declaração de existência de vaga na instituição de destino",
      "Declaração de responsabilidade da autenticidade dos documentos (ANEXO III ou IV)"
    ],
    flow: "DDE > Coordenação do Curso > NADA CONSTA > Coordenação do Curso > CCA"
  },
  {
    processId: "53",
    title: "Transferência para outro curso técnico (transferência interna)",
    description: "Transferência para outro Curso Técnico no âmbito do mesmo Campus.",
    documentsRequired: [],
    flow: "DDE > Assistência Estudantil > Coordenação do Curso > NADA CONSTA > Coordenação do Curso > CCA"
  }
];

(async () => {
  try {
    sendMultipleItems(items);
  } catch (error) {
    console.log(error);
  }
})();