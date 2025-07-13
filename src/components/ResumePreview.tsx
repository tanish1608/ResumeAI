import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
import { ResumeData } from '../types/Resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  // Validate resume data
  if (!resumeData || !resumeData.personalInfo) {
    return (
      <div style={{ 
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14pt',
        color: '#666'
      }}>
        <p>Please fill in your personal information to see the preview.</p>
      </div>
    );
  }

  const { personalInfo, education, experience, projects, skills, achievements } = resumeData;

  return (
    <div 
      id="resume-preview" 
      className="bg-white mx-auto shadow-lg"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '5mm',
        fontSize: '11pt',
        lineHeight: '1.4',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16pt' }}>
        <h1 
          style={{ 
            fontSize: '18pt', 
            lineHeight: '1.2', 
            fontWeight: 'bold', 
            margin: '0 0 4pt 0' 
          }}
        >
          {personalInfo.fullName}
        </h1>
        <div style={{ fontSize: '10pt', marginBottom: '4pt' }}>
          <span>{personalInfo.email}</span>
          {personalInfo.phone && (
            <>
              <span> | </span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.address && (
            <>
              <span> | </span>
              <span>{personalInfo.address}</span>
            </>
          )}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <>
              {personalInfo.linkedin && (
                <>
                  <span> | </span>
                  <a 
                    href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#000000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <Linkedin style={{ width: '10pt', height: '10pt', marginRight: '2pt' }} />
                    <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                  </a>
                </>
              )}
              {personalInfo.github && (
                <>
                  <span> | </span>
                  <a 
                    href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#000000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <Github style={{ width: '10pt', height: '10pt', marginRight: '2pt' }} />
                    <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                  </a>
                </>
              )}
              {personalInfo.website && (
                <>
                  <span> | </span>
                  <a 
                    href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#000000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <Globe style={{ width: '10pt', height: '10pt', marginRight: '2pt' }} />
                    <span>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: '16pt' }}>
          <h2 
            style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5pt',
              borderBottom: '1px solid black', 
              paddingBottom: '1pt',
              margin: '0 0 8pt 0'
            }}
          >
            EDUCATION
          </h2>
          <div>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4pt' }}>
                  <div>
                    <span style={{ fontSize: '11pt', fontWeight: 'bold' }}>{edu.school}</span>
                    <span style={{ fontSize: '11pt' }}>, {edu.degree}</span>
                    {edu.gpa && <span style={{ fontSize: '11pt' }}>, GPA: {edu.gpa}</span>}
                  </div>
                  <div style={{ fontSize: '11pt', textAlign: 'right' }}>
                    {edu.graduationDate}
                  </div>
                </div>
                {edu.relevantCoursework && (
                  <p style={{ fontSize: '10pt', margin: '2pt 0 0 0' }}>
                    <span style={{ fontWeight: 'bold' }}>Relevant Coursework:</span> {edu.relevantCoursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '16pt' }}>
          <h2 
            style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5pt',
              borderBottom: '1px solid black', 
              paddingBottom: '1pt',
              margin: '0 0 8pt 0'
            }}
          >
            TECHNICAL SKILLS
          </h2>
          <div>
            {skills.map((skill, index) => (
              <div key={index} style={{ marginBottom: '8pt' }}>
                <p style={{ fontSize: '10pt', margin: '0' }}>
                  <span style={{ fontWeight: 'bold' }}>{skill.category}:</span> {(skill.items || []).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '16pt' }}>
          <h2 
            style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5pt',
              borderBottom: '1px solid black', 
              paddingBottom: '1pt',
              margin: '0 0 8pt 0'
            }}
          >
            PROFESSIONAL EXPERIENCE
          </h2>
          <div>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '16pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4pt' }}>
                  <div>
                    <span style={{ fontSize: '11pt', fontWeight: 'bold' }}>{exp.title}</span>
                    <span style={{ fontSize: '11pt' }}>, {exp.company}, {exp.location}</span>
                  </div>
                  <div style={{ fontSize: '11pt', textAlign: 'right' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <ul style={{ 
                  fontSize: '10pt', 
                  marginTop: '2pt', 
                  marginBottom: '0',
                  paddingLeft: '16pt',
                  listStyleType: 'disc'
                }}>
                  {exp.description.map((desc, index) => (
                    desc.trim() && (
                      <li key={index} style={{ marginBottom: '2pt' }}>
                        {desc}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Projects */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '16pt' }}>
          <h2 
            style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5pt',
              borderBottom: '1px solid black', 
              paddingBottom: '1pt',
              margin: '0 0 8pt 0'
            }}
          >
            ACADEMIC PROJECTS
          </h2>
          <div>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '16pt' }}>
                <div style={{ position: 'relative', minHeight: '32pt' }}>
                  <div style={{ float: 'left', width: '70%' }}>
                    <h3 style={{ fontSize: '11pt', fontWeight: 'bold', margin: '0 0 2pt 0' }}>
                      {proj.link ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <Github style={{ width: '11pt', height: '11pt', marginRight: '4pt' }} />
                          <a 
                            href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#000000', textDecoration: 'underline' }}
                          >
                            {proj.title}
                          </a>
                        </span>
                      ) : (
                        proj.title
                      )}
                    </h3>
                    <p style={{ fontSize: '10pt', fontWeight: 'bold', margin: '0' }}>
                      {proj.technologies}
                    </p>
                  </div>
                  <div style={{ float: 'right', width: '30%', textAlign: 'right' }}>
                    <p style={{ fontSize: '11pt', margin: '0' }}>{proj.date}</p>
                  </div>
                  <div style={{ clear: 'both' }}></div>
                </div>
                <ul style={{ 
                  fontSize: '10pt', 
                  marginTop: '4pt', 
                  marginBottom: '0',
                  paddingLeft: '16pt',
                  listStyleType: 'disc'
                }}>
                  {proj.description.map((desc, index) => (
                    desc.trim() && (
                      <li key={index} style={{ marginBottom: '2pt' }}>
                        {desc}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section style={{ marginBottom: '16pt' }}>
          <h2 
            style={{ 
              fontSize: '12pt', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5pt',
              borderBottom: '1px solid black', 
              paddingBottom: '1pt',
              margin: '0 0 8pt 0'
            }}
          >
            ACHIEVEMENTS
          </h2>
          <div>
            <ul style={{ 
              fontSize: '10pt', 
              marginTop: '0',
              marginBottom: '0',
              paddingLeft: '16pt',
              listStyleType: 'disc'
            }}>
              {achievements.map((achievement, index) => (
                achievement.trim() && (
                  <li key={index} style={{ marginBottom: '2pt' }}>
                    {achievement}
                  </li>
                )
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};