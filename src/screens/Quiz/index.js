import React, { useState, useEffect } from 'react'
import QuizBackground from '../../components/QuizBackground'
import QuizContainer from '../../components/QuizContainer'
import AlternativesForm from '../../components/AlternativesForm'
import QuizLogo from '../../components/QuizLogo'
import Widget from '../../components/Widget'
import Button from '../../components/Button'
import { func } from 'prop-types'

import BackLinkArrow from '../../components/BackLinkArrow'

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  )
}

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultados
      </Widget.Header>
      <Widget.Content>
        <p> 
          Você acertou
          {' '}
          {/* {results.reduce((somatoriaAtual, resultAtual) => { 
            const isAcerto = resultAtual === true
            if (isAcerto) {
              return somatoriaAtual + 1
            }
            return somatoriaAtual
          }, 0)} */}
          {results.filter(x => x).length}
          {' '}
          perguntas 
        </p>
        <ul>
          {results.map((result, index) => {
            return(
              <li key={`result_${result}`}>
                #
                {index * 1} 
                {' '}
                Resultado:
                {result === true ? 'Acertou' : 'Errou'}
              </li>
            )})
          }
        </ul>
      </Widget.Content>
    </Widget>
  )
}

function QuestionWidget({ question, totalQuestions, questionIndex, onSubmit, addResult }) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined)
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false)
  const questionId = `question_${questionIndex}`
  const isCorrect = selectedAlternative === question.answer
  const hasAlternativeSelected = selectedAlternative !== undefined

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {` Pergunta ${questionIndex + 1} de ${totalQuestions} `}
        </h3>
      </Widget.Header>
    
      <img 
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover'
        }}
        src={question.image}
      />
    
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm onSubmit={(infosDoEvento) => {
          infosDoEvento.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            addResult(isCorrect)
            onSubmit();
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined);
          }, 3 * 1000)
        }}>
          {
            question.alternatives.map((alternative, index) => {
              const alternativeId = `alternative_${index}`
              const alternativeStatus =  isCorrect ? 'SUCCESS' : 'ERROR'
              const isSelected = selectedAlternative === index

              return (
                <Widget.Topic
                  as="label"
                  key={alternativeId}
                  htmlFor={alternativeId}
                  data-selected={isSelected}
                  data-status={isQuestionSubmited && alternativeStatus}
                >
                  
                  <input
                    id={alternativeId}
                    name={questionId}
                    onChange={() => setSelectedAlternative(index)}
                    type="radio"
                  />
                  {alternative}
                </Widget.Topic>
              )
            })
          }

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p> Você Acertou! </p>}
          {isQuestionSubmited && !isCorrect && <p> Você Errou! </p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  )
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT'
}


export default function QuizPage({externalQuestions, externalBg}) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING)
  const [results, setResults] = React.useState([])
  const totalQuestions = externalQuestions.length
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const questionIndex = currentQuestion
  const question = externalQuestions[questionIndex]
  const bg = externalBg

  function addResult(result) {
    setResults([
      ...results,
      result
    ])
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ)
    }, 1* 1000)
  }, [])

  function handleSubmit() {
    const nextQuestion = questionIndex + 1
     
    if(nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion)
    } else {
      setScreenState(screenStates.RESULT)
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState == screenStates.QUIZ && 
          <QuestionWidget 
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmit}
            addResult={addResult}
          />
        }
        
        {screenState == screenStates.LOADING && <LoadingWidget/>}
        {screenState == screenStates.RESULT && <ResultWidget results={results}/>}
      </QuizContainer>
    </QuizBackground>
  )
} 