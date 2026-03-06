// validateProductInfo 및 validateArticleInfo 함수 구현
// ( 필수 필드 누락, 데이터 타입 검증 등)

// 검증 실패 시 400 bad request 상태 코드를 가진 valisationError 객체를 next() 함수로 전달

// 1. 사용자 정의 오류 클래스 정의
class ValidationError extends Error {
   constructor(message, status = 400) {
      super(message);
      this.name = "ValidationError";
      this.status = status;
   }
}

// 2. 상품 등록/수정 유효성 검사 미들웨어
export const validateProductInfo = (req, res, next) => {
   // 상품 필드 정의: name, description, price, tags
   const { name, price, description } = req.body;
   // 상품 필수 필드 name-400, id -404
   // 2-1. 필수 필드 누락 검사 (name, id 필수 )
   if (!name || !price) {
      // 400 상태 코드를 가진 ValidationError 객체를 next()로 전달
      return next(new ValidationError("상품명과 가격은 필수 입력란입니다."));
   }
   if (!description) {
      return next(new ValidationError("상품의 설명은 필수 입력란입니다."));
   }
   // 2-2. 데이터 타입 검증
   // price: 숫자(number)여야 합니다.
   if (typeof price !== "number" || isNaN(price) || price < 0) {
      return next(new ValidationError("가격은 0보다 큰 숫자로 입력해주세요."));
   }

   // 모든 검증 통과 시 다음 미들웨어로 이동
   next();
};

// 3. 게시글 등록/수정 유효성 검사 미들웨어
export const validateArticleInfo = (req, res, next) => {
   // 게시글 필드 정의: title, content
   const { title, content } = req.body;

   // 3-1. 필수 필드 누락 검사 (title, content를 필수라고 가정)
   if (!title || !content) {
      return next(new ValidationError("제목과 내용은 필수 입력란입니다."));
   }

   // 3-2. 데이터 타입 검증 (title, content가 문자열인지 확인)
   if (typeof title !== "string" || typeof content !== "string") {
      return next(new ValidationError("제목과 내용은 문자로 입력해주세요."));
   }

   // 모든 검증 통과 시 다음 미들웨어로 이동
   next();
};

// 박태원님 코드 참조 ( id가 숫자 아닐 때)
// export const validateId = (req, res, next) => {
//    const { id } = req.params; // 👈 URL 경로 매개변수에서 ID 가져옴

//    // 10진수 숫자 문자열인지 확인
//    const isNumeric = /^\d+$/.test(id); // 👈 정규식 검사

//    if (!isNumeric) {
//       // 유효하지 않은 형식일 경우 ValidationError 발생 (400)
//       const error = new ValidationError(
//          `ID '${id}'가 잘못 되었습니다. ID는 유효한 숫자 형식이어야 합니다.`,
//          400 // 👈 400 Bad Request 상태 코드를 포함한다고 가정
//       );
//       return next(error);
//    }

//    next();
// };
