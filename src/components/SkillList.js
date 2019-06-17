import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SkillListTab from "./SkillListTab";

const SkillList = props => {
  const skillLevels = ["Beginner", "Basic", "Skilled", "Advanced", "Expert"];
  const [selectedLevel, setLevel] = useState(5);

  function skillsByLevel(level) {
    const filteredSkills = props.skills.filter(
      skill => skill.AnswerLevel == level
    );
    return (
      <ul className="skill-list__list">
        {filteredSkills.map((skill, index) => (
          <li
            key={"skill-" + skill.AnswerLevel + index}
            className="skill-list__item"
          >
            <span className="skill-list__name">{skill.ElementName}</span>
            {skill.EasyReadDescription}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="skill-list">
      <div className="matcher__instructions">
        <h2 className="matcher__section-header">Your Skills</h2>
        <div className="matcher__accent" />
        <p>
          Click on the skill level to see which skills you rated at each level
          of aptitude.
        </p>
      </div>
      <div className="skill-list__wrapper">
      <div className="skill-list__menu">
        {skillLevels.reverse().map((level, index) => (
          <SkillListTab key={"level" + index}
                        level={level}
                        value={skillLevels.length - index}
                        selectedLevel={selectedLevel}
                        setLevel={setLevel}
                        />
        ))}
      </div>
      <div className="matcher__border matcher__border--skills">
        <div className="skill-list__content">
          {skillsByLevel(selectedLevel)}
        </div>
      </div>
      </div>
      <div className="controls">
        <Link to="/" className="controls__btn controls__btn--blue"><i className="fas fa-chevron-left"/> Back</Link>
      </div>
      
    </div>
  );
};

export default SkillList;
