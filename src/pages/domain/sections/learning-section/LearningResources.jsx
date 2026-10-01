import React from 'react'
import ResourceCard from '../../../../components/ResourceCard'
import '../../domain.css'

const LearningResources = ({data}) => {
    const resourceCards = data;
  return (
        <section className="learning-resources">
        <div className="container">
          <div className="resources-grid">
            {resourceCards?.map((card, index) => (
              <ResourceCard
                key={index}
                title={card.title}
                subtitle={card.subtitle}
                desc={card.desc}
                btn={card.btn}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>
  )
}

export default LearningResources