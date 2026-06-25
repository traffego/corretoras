-- Migração: popular atributos a partir dos campos existentes (area_total, area_construida, quartos, suites, banheiros, vagas)
-- Executa para todos os imóveis que ainda não têm atributos definidos

UPDATE properties
SET atributos = (
  SELECT jsonb_agg(item ORDER BY item->>'ordem')
  FROM (
    SELECT jsonb_build_object(
      'nome', 'Área Total',
      'icone', 'ruler',
      'descricao', CONCAT(area_total::text, ' m²'),
      'ordem', 1
    ) AS item
    WHERE area_total IS NOT NULL AND area_total > 0

    UNION ALL

    SELECT jsonb_build_object(
      'nome', 'Área Const.',
      'icone', 'ruler',
      'descricao', CONCAT(area_construida::text, ' m²'),
      'ordem', 2
    )
    WHERE area_construida IS NOT NULL AND area_construida > 0

    UNION ALL

    SELECT jsonb_build_object(
      'nome', 'Quartos',
      'icone', 'bed',
      'descricao', quartos::text,
      'ordem', 3
    )
    WHERE quartos IS NOT NULL AND quartos > 0

    UNION ALL

    SELECT jsonb_build_object(
      'nome', 'Suítes',
      'icone', 'bed',
      'descricao', suites::text,
      'ordem', 4
    )
    WHERE suites IS NOT NULL AND suites > 0

    UNION ALL

    SELECT jsonb_build_object(
      'nome', 'Banheiros',
      'icone', 'bath',
      'descricao', banheiros::text,
      'ordem', 5
    )
    WHERE banheiros IS NOT NULL AND banheiros > 0

    UNION ALL

    SELECT jsonb_build_object(
      'nome', 'Vagas',
      'icone', 'car',
      'descricao', vagas::text,
      'ordem', 6
    )
    WHERE vagas IS NOT NULL AND vagas > 0
  ) sub
)
WHERE (atributos IS NULL OR atributos = '[]'::jsonb);
