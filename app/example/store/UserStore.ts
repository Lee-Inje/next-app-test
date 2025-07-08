import { create } from 'zustand'; // Zustand 상태관리 라이브러리 import
import { produce } from 'immer'; // 불변성 유지를 위한 immer import

// 사용자(User) 타입 정의
export type User = {
  id: number; // 사용자 고유 번호
  name: string; // 이름
  email: string; // 이메일
  checked?: boolean; // 체크박스 선택 여부(선택적)
  createdAt: string; // 가입일
};

// Zustand에서 관리할 상태와 함수 타입 정의
type UserState = {
  users: User[]; // 전체 사용자 목록
  selectedUsers: User[]; // 선택된 사용자 목록
  setUsers: (users: User[]) => void; // 사용자 목록 설정 함수
  toggleCheck: (id: number) => void; // users 목록에서 체크박스 토글 함수
  toggleSelectedCheck: (id: number) => void; // selectedUsers 목록에서 체크박스 토글 함수
  moveSelected: () => void; // 체크된 users를 selectedUsers로 이동
  moveBack: () => void; // 체크된 selectedUsers를 users로 되돌림
};

// Zustand 스토어 생성
export const useUserStore = create<UserState>()(
  (set) => ({
    users: [], // 전체 사용자 목록 초기값
    selectedUsers: [], // 선택된 사용자 목록 초기값
    setUsers: (users) => set(() => ({ users })), // 사용자 목록 설정
    // users 배열에서 id가 일치하는 사용자의 checked 값을 토글
    toggleCheck: (id) =>
      set(
        produce((state) => {
          const user = state.users.find((u: { id: number; }) => u.id === id); // id로 사용자 찾기
          if (user) user.checked = !user.checked; // checked 값 반전
        })
      ),
    // selectedUsers 배열에서 id가 일치하는 사용자의 checked 값을 토글
    toggleSelectedCheck: (id) =>
      set(
        produce((state) => {
          const user = state.selectedUsers.find((u: { id: number; }) => u.id === id); // id로 사용자 찾기
          if (user) user.checked = !user.checked; // checked 값 반전
        })
      ),
    // users에서 체크된 항목만 selectedUsers로 이동(중복 방지), users에서는 제거
    moveSelected: () =>
      set(
        produce((state) => {
          const selected = state.users.filter((u: { checked: any; }) => u.checked); // 체크된 항목만 필터링
          if (selected.length === 0) {
            console.log('선택된 항목이 없습니다.');
            return;
          }
          // 선택된 항목들을 selectedUsers에 추가 (중복 방지)
          selected.forEach((selectedUser: any) => {
            const exists = state.selectedUsers.find((u: { id: number; }) => u.id === selectedUser.id);
            if (!exists) {
              state.selectedUsers.push({ ...selectedUser, checked: false }); // checked false로 초기화
            }
          });
          // 원본 목록에서 체크된 항목들 제거
          state.users = state.users.filter((u: { checked: any; }) => !u.checked);
          console.log(`${selected.length}개 항목이 이동되었습니다.`);
        })
      ),
    // selectedUsers에서 체크된 항목만 users로 되돌림(중복 방지), selectedUsers에서는 제거
    moveBack: () =>
      set(
        produce((state) => {
          const selected = state.selectedUsers.filter((u: { checked: any; }) => u.checked); // 체크된 항목만 필터링
          if (selected.length === 0) {
            console.log('선택된 항목이 없습니다.');
            return;
          }
          // 선택된 항목들을 users에 추가 (중복 방지)
          selected.forEach((selectedUser: any) => {
            const exists = state.users.find((u: { id: number; }) => u.id === selectedUser.id);
            if (!exists) {
              state.users.push({ ...selectedUser, checked: false }); // checked false로 초기화
            }
          });
          // selectedUsers에서 체크된 항목들 제거
          state.selectedUsers = state.selectedUsers.filter((u: { checked: any; }) => !u.checked);
          console.log(`${selected.length}개 항목이 되돌려졌습니다.`);
        })
      ),
  })
);
